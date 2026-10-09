import { createHash } from "node:crypto";
import type { APIRequestContext } from "playwright";
import type { Evidence } from "../analyzer/types.js";
import { fetchActiveRule } from "../browser/active_scan.js";
import type { Response } from "../browser/types.js";
import type { AssetFingerprint } from "../signatures/_types.js";

const MAX_ASSET_REQUESTS = 8;
const MIN_VERSION_MATCHES = 2;

function attribute(tag: string, name: string): string | undefined {
  const attributes = /([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  for (const match of tag.matchAll(attributes)) {
    if (match[1]?.toLowerCase() !== name) continue;
    return (match[2] ?? match[3] ?? match[4])?.replace(/&amp;/gi, "&");
  }
  return undefined;
}

function assetUrls(response: Response, fingerprints: AssetFingerprint[]) {
  const urls = new Map<string, AssetFingerprint>();
  const html = (response.body ?? "").replace(/<!--[\s\S]*?-->/g, "");
  // Consume script contents with their opening tag so inline HTML strings do
  // not turn into requests. Only scripts and styles actually linked by the
  // matched page, with a known asset suffix, are eligible.
  const tags =
    /<script\b(?:"[^"]*"|'[^']*'|[^'">])*>[\s\S]*?(?:<\/script\s*>|$)|<(?:link|base)\b(?:"[^"]*"|'[^']*'|[^'">])*>/gi;
  const openings = [...html.matchAll(tags)].map(
    (match) =>
      /^<(script|link|base)\b(?:"[^"]*"|'[^']*'|[^'">])*>/i.exec(match[0])!,
  );
  let baseUrl = response.url;
  const baseTag = openings.find(
    (match) => match[1]?.toLowerCase() === "base",
  )?.[0];
  const baseHref = baseTag && attribute(baseTag, "href");
  if (baseHref) {
    try {
      baseUrl = new URL(baseHref, response.url).href;
    } catch {
      return urls;
    }
  }
  for (const match of openings) {
    const tag = match[0];
    const type = match[1]?.toLowerCase();
    if (type === "base") continue;
    if (
      type === "link" &&
      !attribute(tag, "rel")?.toLowerCase().split(/\s+/).includes("stylesheet")
    )
      continue;
    const value = attribute(tag, type === "script" ? "src" : "href");
    if (!value) continue;
    try {
      const url = new URL(value, baseUrl);
      if (
        url.origin !== new URL(response.url).origin ||
        url.username ||
        url.password
      )
        continue;
      const fingerprint = fingerprints.find((item) =>
        url.pathname.endsWith(item.pathSuffix),
      );
      if (!fingerprint) continue;
      url.hash = "";
      urls.set(url.href, fingerprint);
      if (urls.size === MAX_ASSET_REQUESTS) break;
    } catch {
      continue;
    }
  }
  return urls;
}

export async function fingerprintAssets(
  page: Response,
  fingerprints: AssetFingerprint[],
  request: APIRequestContext,
  timeoutMs: number,
): Promise<{ evidences: Evidence[]; versionCandidates?: string[] }> {
  const evidences: Evidence[] = [];
  const matchedPaths = new Set<string>();
  let candidates: Set<string> | undefined;
  let unknownAsset = false;
  // Bound the whole fingerprint phase, rather than multiplying the caller's
  // timeout by the number of linked resources.
  const deadline = Date.now() + timeoutMs;
  for (const [assetUrl, fingerprint] of assetUrls(page, fingerprints)) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) break;
    const url = new URL(assetUrl);
    const response = await fetchActiveRule(
      page.url,
      url.pathname + url.search,
      request,
      remaining,
      true,
    );
    if (!response || response.status !== 200 || !response.body) continue;
    const hash = createHash("sha256")
      .update(response.body.replace(/\r\n/g, "\n"))
      .digest("hex");
    const versions = fingerprint.hashes[hash];
    if (!versions?.length) {
      unknownAsset = true;
      continue;
    }
    // An empty intersection is a conflict, not an uninitialized candidate set.
    candidates =
      candidates === undefined
        ? new Set(versions)
        : new Set(versions.filter((version) => candidates!.has(version)));
    matchedPaths.add(fingerprint.pathSuffix);
    evidences.push({
      type: "hash",
      value: `sha256:${hash}`,
      version: undefined,
      confidence: "medium",
      host: response.host,
      sourceUrl: response.url,
      isFirstParty: true,
    });
  }
  if (unknownAsset || !candidates?.size) return { evidences };
  const versions = [...candidates].sort((a, b) =>
    a.localeCompare(b, "en", { numeric: true }),
  );
  if (versions.length === 1 && matchedPaths.size >= MIN_VERSION_MATCHES) {
    for (const evidence of evidences) evidence.version = versions[0];
    return { evidences };
  }
  return { evidences, versionCandidates: versions };
}
