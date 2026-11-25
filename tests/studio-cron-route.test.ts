import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  getWorkingArticle,
  listArticles,
  listDueScheduledArticles,
  lookupLatestVersion,
  recordPublishedVersion,
  updateArticle,
} = vi.hoisted(() => ({
  getWorkingArticle: vi.fn(),
  listArticles: vi.fn(),
  listDueScheduledArticles: vi.fn(),
  lookupLatestVersion: vi.fn(),
  recordPublishedVersion: vi.fn(),
  updateArticle: vi.fn(),
}));

vi.mock("@/lib/studio-store", () => ({
  getWorkingArticle,
  listArticles,
  listDueScheduledArticles,
  lookupLatestVersion,
  recordPublishedVersion,
  updateArticle,
}));

import { GET } from "@/app/api/studio/cron/publish/route";

const scheduled = {
  id: "11111111-1111-4111-8111-111111111111",
  slug: "scheduled-note",
  status: "scheduled",
  scheduled_at: "2020-01-01T00:00:00.000Z",
};

beforeEach(() => {
  process.env.CRON_SECRET = "test-secret";
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-25T19:00:00.000Z"));
  listDueScheduledArticles.mockResolvedValue([scheduled]);
  listArticles.mockResolvedValue([]);
  getWorkingArticle.mockReset();
  lookupLatestVersion.mockReset();
  recordPublishedVersion.mockReset();
  updateArticle.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

async function callCron() {
  return GET(new Request("https://example.test/api/studio/cron/publish", {
    headers: { authorization: "Bearer test-secret" },
  }));
}

describe("scheduled publishing version gates", () => {
  it("skips an error state with a reason and leaves the scheduled article untouched", async () => {
    lookupLatestVersion.mockResolvedValue({ state: "error", reason: "Article version storage could not be read." });
    const response = await callCron();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.skipped).toEqual([{
      id: scheduled.id,
      slug: scheduled.slug,
      reason: "Article version storage could not be read.",
    }]);
    expect(updateArticle).not.toHaveBeenCalled();
    expect(recordPublishedVersion).not.toHaveBeenCalled();
    expect(getWorkingArticle).not.toHaveBeenCalled();
  });

  it("skips a successful no-version state with a retry reason and preserves schedule state", async () => {
    lookupLatestVersion.mockResolvedValue({ state: "no-version" });
    const response = await callCron();
    const body = await response.json();
    expect(body.skipped[0].reason).toContain("No article version exists yet");
    expect(body.skipped[0].reason).toContain("can be retried");
    expect(updateArticle).not.toHaveBeenCalled();
    expect(recordPublishedVersion).not.toHaveBeenCalled();
    expect(getWorkingArticle).not.toHaveBeenCalled();
  });
});
