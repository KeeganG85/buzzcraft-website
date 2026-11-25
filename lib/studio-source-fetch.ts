import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";
import type { SourceFetch } from "@/lib/studio-source";

const MAX_RESPONSE_BYTES = 200_000;

export const pinnedSourceFetch: SourceFetch = (input, init, pinnedAddress) =>
  new Promise((resolve, reject) => {
    const url = new URL(input);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      reject(new Error("Unsupported source protocol"));
      return;
    }
    const hostname = url.hostname.replace(/^\[|\]$/g, "");
    const family = isIP(pinnedAddress);
    if (!family) {
      reject(new Error("Invalid pinned address"));
      return;
    }
    const requestFn = url.protocol === "https:" ? httpsRequest : httpRequest;
    const request = requestFn({
      protocol: url.protocol,
      hostname,
      port: url.port || undefined,
      path: `${url.pathname}${url.search}`,
      method: init.method ?? "GET",
      headers: { ...Object.fromEntries(new Headers(init.headers).entries()), "Accept-Encoding": "identity", Host: url.host },
      ...(url.protocol === "https:" && !isIP(hostname) ? { servername: hostname } : {}),
      lookup: (requestedHost, options, callback) => {
        if (requestedHost !== hostname) {
          callback(new Error("Unexpected lookup host"), "", 0);
          return;
        }
        if (options.all) callback(null, [{ address: pinnedAddress, family }]);
        else callback(null, pinnedAddress, family);
      },
      signal: init.signal ?? undefined,
    });
    request.once("response", (response) => {
      const status = response.statusCode ?? 502;
      const headers = new Headers();
      for (const [name, value] of Object.entries(response.headers)) {
        if (Array.isArray(value)) value.forEach((part) => headers.append(name, part));
        else if (value !== undefined) headers.set(name, value);
      }
      if ([301, 302, 303, 307, 308].includes(status)) {
        response.destroy();
        resolve(new Response(null, { status, headers }));
        return;
      }
      const chunks: Buffer[] = [];
      let size = 0;
      response.on("data", (chunk: Buffer | string) => {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        size += buffer.length;
        if (size > MAX_RESPONSE_BYTES) {
          response.destroy(new Error("Source response exceeded limit"));
          return;
        }
        chunks.push(buffer);
      });
      response.once("end", () => {
        if (status < 200 || status > 599) { reject(new Error("Invalid source response status")); return; }
        const body = Buffer.concat(chunks);
        resolve(new Response(body.length ? body : null, { status, headers }));
      });
      response.once("error", reject);
    });
    request.once("error", reject);
    request.end();
  });
