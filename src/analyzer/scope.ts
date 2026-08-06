import { getHostFromUrl, isFirstPartyHost } from "../browser/utils.js";

// Matches absolute http(s) URLs and protocol-relative URLs (`//host/...`),
// stopping at characters that commonly delimit a URL inside HTML/JS/CSS
// (whitespace, quotes, backticks, angle brackets, parentheses, backslashes).
const ABSOLUTE_URL_PATTERN = /(?:https?:)?\/\/[^\s"'`<>()\\]+/gi;

// A half-open character range [start, end) within a body.
export type UrlSpan = [start: number, end: number];

/**
 * Returns the character spans of absolute / protocol-relative URLs in `body`
 * whose host is out of scope (i.e. not first-party to the scanned target).
 *
 * Used by server-runtime body matching to reject pattern hits that fall inside a
 * third-party URL quoted within a first-party file (e.g. `wp-content` inside an
 * unrelated site's URL). The body itself is never modified, so no match can be
 * created or destroyed across the excluded region.
 *
 * URLs without an identifiable host (unparseable, or an empty authority such as
 * `https://./...`) are not treated as out of scope, so only provably
 * out-of-scope URLs are excluded. When the in-scope host set is unknown (empty),
 * no spans are returned.
 */
export function outOfScopeUrlSpans(
  body: string,
  inScopeHosts: string[],
): UrlSpan[] {
  if (inScopeHosts.length === 0) {
    return [];
  }

  const spans: UrlSpan[] = [];
  // Copy source and flags from the shared pattern (fresh lastIndex, no divergence).
  const regex = new RegExp(ABSOLUTE_URL_PATTERN);
  let match: RegExpExecArray | null;
  while ((match = regex.exec(body)) !== null) {
    const url = match[0];
    // Give protocol-relative URLs a scheme so the host can be parsed.
    const normalized = url.startsWith("//") ? `https:${url}` : url;
    const host = getHostFromUrl(normalized);
    if (!host) {
      continue;
    }
    const inScope = inScopeHosts.some((inScopeHost) =>
      isFirstPartyHost(inScopeHost, host),
    );
    if (!inScope) {
      spans.push([match.index, match.index + url.length]);
    }
  }
  return spans;
}
