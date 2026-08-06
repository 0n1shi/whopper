import { getHostFromUrl, isFirstPartyHost } from "../browser/utils.js";

// Matches absolute http(s) URLs and protocol-relative URLs (`//host/...`),
// stopping at characters that commonly delimit a URL inside HTML/JS/CSS
// (whitespace, quotes, backticks, angle brackets, parentheses, backslashes).
// Tokens that do not parse to a host are left untouched (see below), so a bare
// `//foo` in a comment is only ever removed when it resolves to an out-of-scope
// host, and removing text can never introduce a new match.
const ABSOLUTE_URL_PATTERN = /(?:https?:)?\/\/[^\s"'`<>()\\]+/gi;

/**
 * Removes absolute URLs whose host is out of scope (i.e. not first-party to the
 * scanned target) from a response body.
 *
 * A server-runtime signature is meant to answer "does the scanned site itself
 * run this technology?". A first-party file (e.g. a bundled `.min.js`) can quote
 * an unrelated third-party URL as a plain string; matching a body pattern such
 * as `wp-content` against that string wrongly attributes another site's
 * technology to the target. Stripping out-of-scope URLs before matching removes
 * that source of over-detection.
 *
 * In-scope absolute URLs and relative paths (e.g. `/wp-content/...`) are left
 * untouched, so genuine first-party references still match. When the in-scope
 * host set is unknown (empty), the body is returned unchanged.
 */
export function stripOutOfScopeUrls(
  body: string,
  inScopeHosts: string[],
): string {
  if (inScopeHosts.length === 0) {
    return body;
  }

  return body.replace(ABSOLUTE_URL_PATTERN, (match) => {
    // Give protocol-relative URLs a scheme so the host can be parsed.
    const normalized = match.startsWith("//") ? `https:${match}` : match;
    const host = getHostFromUrl(normalized);
    if (host === undefined) {
      // Not a parseable URL host; leave it as-is.
      return match;
    }
    const inScope = inScopeHosts.some((inScopeHost) =>
      isFirstPartyHost(inScopeHost, host),
    );
    // Replace with a single space so surrounding tokens do not merge across the
    // removed URL.
    return inScope ? match : " ";
  });
}
