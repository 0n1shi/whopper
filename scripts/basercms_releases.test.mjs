import { describe, expect, it, vi } from "vitest";
import { discoverReleases } from "./basercms_releases.mjs";

const firstSha = "a".repeat(40);
const secondSha = "b".repeat(40);
const manifest = {
  repository: "baserproject/basercms",
  releases: [{ version: "5.0.0", commit: firstSha }],
};
const tag = (name, sha = secondSha) => ({ name, commit: { sha } });
const listing = (tags) => ({ ok: true, status: 200, json: async () => tags });

describe("discoverReleases", () => {
  it("adds stable supported releases in numeric order and preserves pinned sources", async () => {
    const fetchImpl = vi.fn(async () =>
      listing([
        tag("5.0.10"),
        tag("5.0.2"),
        tag("5.0.0", firstSha),
        tag("4.3.7.1"),
        tag("5.0.11-rc1"),
        tag("6.0.0"),
        tag("3.0.0"),
        tag("5.x"),
      ]),
    );
    const releases = await discoverReleases(manifest, { fetchImpl });
    expect(releases.map((r) => r.version)).toEqual([
      "4.3.7.1",
      "5.0.0",
      "5.0.2",
      "5.0.10",
    ]);
    expect(releases[1].commit).toBe(firstSha);
    expect(manifest.releases).toEqual([{ version: "5.0.0", commit: firstSha }]);
  });

  it("follows pagination and authenticates requests when a token is provided", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        listing(Array.from({ length: 100 }, (_, i) => tag(`3.0.${i}`))),
      )
      .mockResolvedValueOnce(listing([tag("5.0.1")]));
    const releases = await discoverReleases(manifest, {
      fetchImpl,
      token: "example-token",
    });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(fetchImpl.mock.calls[1][0]).toBe(
      "https://api.github.com/repos/baserproject/basercms/tags?per_page=100&page=2",
    );
    expect(fetchImpl.mock.calls[0][1].headers.Authorization).toBe(
      "Bearer example-token",
    );
    expect(releases.map((r) => r.version)).toEqual(["5.0.0", "5.0.1"]);
  });

  it("is unchanged on a second discovery of the same tags", async () => {
    const fetchImpl = vi.fn(async () =>
      listing([tag("5.0.1"), tag("5.0.0", firstSha)]),
    );
    const releases = await discoverReleases(manifest, { fetchImpl });
    expect(
      await discoverReleases({ ...manifest, releases }, { fetchImpl }),
    ).toEqual(releases);
  });

  it("retains historical entries absent from the current tag listing", async () => {
    expect(
      await discoverReleases(manifest, { fetchImpl: async () => listing([]) }),
    ).toEqual(manifest.releases);
  });

  it("fails without repinning when an existing tag points to another commit", async () => {
    await expect(
      discoverReleases(manifest, {
        fetchImpl: async () => listing([tag("5.0.0")]),
      }),
    ).rejects.toThrow("Upstream tag changed: 5.0.0");
    expect(manifest.releases[0].commit).toBe(firstSha);
  });

  it.each([403, 429, 500])(
    "fails on HTTP %s instead of producing a partial manifest",
    async (status) => {
      await expect(
        discoverReleases(manifest, {
          fetchImpl: async () => ({ ok: false, status }),
        }),
      ).rejects.toThrow(`HTTP ${status}`);
    },
  );

  it("rejects invalid tag data and unpinned commits", async () => {
    await expect(
      discoverReleases(manifest, { fetchImpl: async () => listing({}) }),
    ).rejects.toThrow("Invalid tag listing");
    await expect(
      discoverReleases(manifest, {
        fetchImpl: async () => listing([tag("5.0.1", "main")]),
      }),
    ).rejects.toThrow("Invalid commit SHA");
  });
});
