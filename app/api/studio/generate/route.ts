import { lookup } from "node:dns/promises";
import { NextResponse } from "next/server";
import { createRateLimiter, requestIp } from "@/lib/rate-limit";
import { plainTextToDoc } from "@/lib/studio-doc";
import {
  articleSavePlan,
  isUuid,
  rowPatchForSave,
  studioSession,
  type ArticleRecord,
} from "@/lib/studio";
import {
  buildMessages,
  draftRecord,
  generationActions,
  generationLog,
  jsonSchemaFor,
  knowledgeLabel,
  parseGeneration,
  readGenerationConfig,
  readUpstream,
  sourcesFromSearch,
  type GenerationAction,
  type UpstreamResult,
} from "@/lib/studio-generate";
import { fetchPublicSource, publicHttpUrl, type SourcePage } from "@/lib/studio-source";
import {
  getWorkingArticle,
  insertArticleSources,
  insertGenerationLog,
  saveArticle,
  saveDraftVersion,
  updateArticle,
} from "@/lib/studio-store";

export const runtime = "nodejs";

const limiter = createRateLimiter(8, 10 * 60 * 1000);

function unavailable() {
  return NextResponse.json(
    {
      ok: false,
      error: "Generation is not configured. Set XAI_API_KEY and XAI_MODEL. The editor can still save.",
    },
    { status: 503 },
  );
}

async function lookupHost(hostname: string): Promise<string[]> {
  const records = await lookup(hostname, { all: true, verbatim: true });
  return records.map((record) => record.address);
}

async function complete(
  config: { apiKey: string; model: string },
  action: GenerationAction,
  messages: { role: "system" | "user"; content: string }[],
  allowSearch: boolean,
): Promise<UpstreamResult | { errorClass: string }> {
  const send = (search: boolean) =>
    fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      signal: AbortSignal.timeout(45_000),
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 0.2,
        response_format: {
          type: "json_schema",
          json_schema: { name: `studio_${action}`, strict: true, schema: jsonSchemaFor(action) },
        },
        ...(search ? { search_parameters: { mode: "auto", return_citations: true, max_search_results: 5 } } : {}),
      }),
    });

  try {
    let response = await send(allowSearch);
    let searchedRequest = allowSearch;
    if (allowSearch && response.status === 400) {
      response = await send(false);
      searchedRequest = false;
    }
    if (!response.ok) return { errorClass: `upstream_${response.status}` };
    const upstream = readUpstream(await response.json());
    if (!upstream) return { errorClass: "malformed_json" };
    if (!searchedRequest) return { ...upstream, citations: [], searched: false };
    return upstream;
  } catch (error) {
    const name = error instanceof Error ? error.name : "error";
    return { errorClass: name === "TimeoutError" || name === "AbortError" ? "timeout" : "upstream_network" };
  }
}

async function acceptRevision(body: Record<string, unknown>) {
  const id = String(body.articleId ?? "");
  const text = String(body.text ?? "").trim();
  if (!isUuid(id) || !text || text.length > 20_000) {
    return NextResponse.json({ ok: false, error: "Accept needs an article and the suggested text." }, { status: 422 });
  }
  const working = await getWorkingArticle(id);
  if (!working) return NextResponse.json({ ok: false, error: "That draft was not found." }, { status: 404 });
  const plan = articleSavePlan(working.status, "save", null);
  const next: ArticleRecord = { ...working, body: text, status: plan.status };
  const saved = await updateArticle(id, rowPatchForSave(next, plan.updateRowContent));
  if (!saved) {
    return NextResponse.json({ ok: false, error: "The suggestion was not saved. The editor can still save." }, { status: 503 });
  }
  const drafted = await saveDraftVersion(
    { ...next, id, status: working.status, published_version_id: saved.published_version_id ?? working.published_version_id },
    plainTextToDoc(text),
  );
  if (!drafted) {
    return NextResponse.json({ ok: false, error: "The suggestion was not saved. The editor can still save." }, { status: 503 });
  }
  return NextResponse.json({ ok: true, accepted: true, articleId: id, status: working.status });
}

export async function POST(request: Request) {
  if (limiter.limited(requestIp(request))) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please try again shortly." }, { status: 429 });
  }
  const session = await studioSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "The request was not JSON." }, { status: 400 });
  }

  const action = String(body.action ?? "");
  if (!generationActions.includes(action as GenerationAction)) {
    return NextResponse.json({ ok: false, error: "Unknown generation action." }, { status: 422 });
  }
  const chosen = action as GenerationAction;
  if (body.accept === true) return acceptRevision(body);

  const config = readGenerationConfig({ apiKey: process.env.XAI_API_KEY, model: process.env.XAI_MODEL });
  if (!config) return unavailable();

  const topic = String(body.topic ?? "").trim().slice(0, 500);
  const selection = String(body.selection ?? "").trim().slice(0, 8000);
  const notes = String(body.notes ?? "").trim().slice(0, 4000);
  const headline = String(body.headline ?? "").trim().slice(0, 180);
  const audience = String(body.audience ?? "").trim().slice(0, 240);
  const revising = chosen === "rewrite" || chosen === "expand" || chosen === "shorten";
  if (revising && !selection) {
    return NextResponse.json({ ok: false, error: "Select some text before asking for a revision." }, { status: 422 });
  }
  if (!revising && !topic) {
    return NextResponse.json({ ok: false, error: "A topic is required." }, { status: 422 });
  }

  const urls = Array.isArray(body.urls) ? body.urls.map(String).map((url) => url.trim()).filter(Boolean).slice(0, 5) : [];
  const sources: SourcePage[] = [];
  for (const url of urls) {
    const page = await fetchPublicSource(url, { lookup: lookupHost, fetch }).catch(() => null);
    if (page) sources.push(page);
  }

  const allowSearch = chosen === "brief" || chosen === "draft";
  const upstream = await complete(
    config,
    chosen,
    buildMessages({ action: chosen, topic: topic || "Revision", headline, audience, notes, selection, sources }),
    allowSearch,
  );
  if ("errorClass" in upstream) {
    await insertGenerationLog(
      generationLog({ model: config.model, action: chosen, status: "error", errorClass: upstream.errorClass }),
    );
    const malformed = upstream.errorClass === "malformed_json";
    return NextResponse.json(
      { ok: false, retry: true, error: malformed ? "The model response was not usable. Try again." : "Generation failed. Try again." },
      { status: malformed ? 422 : 502 },
    );
  }

  const parsed = parseGeneration(chosen, upstream.content);
  if (!parsed) {
    await insertGenerationLog(
      generationLog({
        model: config.model,
        action: chosen,
        status: "error",
        promptTokens: upstream.promptTokens,
        completionTokens: upstream.completionTokens,
        errorClass: "malformed_json",
      }),
    );
    return NextResponse.json({ ok: false, retry: true, error: "The model response was not usable. Try again." }, { status: 422 });
  }

  await insertGenerationLog(
    generationLog({
      model: config.model,
      action: chosen,
      status: "ok",
      promptTokens: upstream.promptTokens,
      completionTokens: upstream.completionTokens,
    }),
  );

  const label = knowledgeLabel(upstream.searched);
  const references = [
    ...sourcesFromSearch(upstream.citations, upstream.searched),
    ...sources.map((page) => ({
      title: "Supplied page",
      url: page.url,
      claim: "Supplied by the editor. The page was treated as untrusted data and has not been checked.",
    })),
  ].filter((source) => publicHttpUrl(source.url));

  if (parsed.action === "draft") {
    const record = draftRecord(parsed.draft, upstream.searched);
    const saved = await saveArticle(record);
    if (!saved || saved.status !== "draft") {
      return NextResponse.json({ ok: false, error: "The draft was not stored. Nothing was published." }, { status: 503 });
    }
    const drafted = await saveDraftVersion(
      { ...record, id: saved.id, status: "draft" } as ArticleRecord,
      plainTextToDoc(parsed.draft.body),
    );
    if (!drafted) {
      return NextResponse.json({ ok: false, error: "The draft version was not stored. Nothing was published." }, { status: 503 });
    }
    if (references.length > 0) await insertArticleSources(saved.id, references);
    return NextResponse.json({
      ok: true,
      saved: true,
      accepted: false,
      articleId: saved.id,
      status: "draft",
      knowledge: label,
      sources: references.map((source) => ({ ...source, verified: false })),
      result: parsed,
    });
  }

  if (parsed.action === "rewrite" || parsed.action === "expand" || parsed.action === "shorten") {
    return NextResponse.json({
      ok: true,
      saved: false,
      accepted: false,
      knowledge: label,
      suggestion: parsed.revision.text,
      result: parsed,
    });
  }

  return NextResponse.json({
    ok: true,
    saved: false,
    accepted: false,
    knowledge: label,
    sources: references.map((source) => ({ ...source, verified: false })),
    result: parsed,
  });
}
