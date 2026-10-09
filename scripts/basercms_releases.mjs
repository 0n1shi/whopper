const PAGE_SIZE = 100;
const REQUEST_TIMEOUT_MS = 30000;
const RELEASE_VERSION = /^(4|5)\.\d+\.\d+(?:\.\d+)?$/;
const COMMIT_SHA = /^[0-9a-f]{40}$/;

export async function discoverReleases(
  manifest,
  { fetchImpl = fetch, token } = {},
) {
  const releases = new Map(
    manifest.releases.map((release) => [release.version, { ...release }]),
  );
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  for (let page = 1; ; page++) {
    const response = await fetchImpl(
      `https://api.github.com/repos/${manifest.repository}/tags?per_page=${PAGE_SIZE}&page=${page}`,
      { headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) },
    );
    if (!response.ok)
      throw new Error(`Failed to discover releases: HTTP ${response.status}`);
    const tags = await response.json();
    if (!Array.isArray(tags)) throw new Error("Invalid tag listing");
    for (const tag of tags) {
      if (typeof tag?.name !== "string" || !RELEASE_VERSION.test(tag.name))
        continue;
      const commit = tag.commit?.sha;
      if (typeof commit !== "string" || !COMMIT_SHA.test(commit))
        throw new Error(`Invalid commit SHA for ${tag.name}`);
      const pinned = releases.get(tag.name);
      // A moved upstream tag must be reviewed, never silently repinned.
      if (pinned && pinned.commit !== commit)
        throw new Error(`Upstream tag changed: ${tag.name}`);
      releases.set(tag.name, { version: tag.name, commit });
    }
    if (tags.length < PAGE_SIZE) break;
  }
  // Keep historical entries even when an upstream tag disappears.
  return [...releases.values()].sort((a, b) =>
    a.version.localeCompare(b.version, "en", { numeric: true }),
  );
}
