import { createHash } from "node:crypto";
import { Buffer } from "node:buffer";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { format } from "prettier";

const root = new URL("../", import.meta.url);
const manifest = JSON.parse(
  await readFile(new URL("basercms_sources.json", import.meta.url), "utf8"),
);
const cache = new URL(".cache/basercms/", root);
await mkdir(cache, { recursive: true });
const concurrency = 6;
const hashes = new Map(
  manifest.assets.map((asset) => [asset.pathSuffix, new Map()]),
);
const coverage = new Map(
  manifest.releases.map(({ version }) => [version, new Map()]),
);
const jobs = manifest.releases.flatMap(({ version, commit }) => {
  if (!/^[0-9a-f]{40}$/.test(commit))
    throw new Error(`Unpinned source: ${version}`);
  return manifest.assets.flatMap((asset) =>
    (asset.sources[version.split(".")[0]] ?? []).map((path) => ({
      version,
      commit,
      path,
      suffix: asset.pathSuffix,
    })),
  );
});
let next = 0;
await Promise.all(
  Array.from({ length: concurrency }, async () => {
    while (next < jobs.length) {
      const { version, commit, path, suffix } = jobs[next++];
      const url = `https://raw.githubusercontent.com/${manifest.repository}/${commit}/${path}`;
      const key = createHash("sha256").update(url).digest("hex");
      const cached = new URL(`${key}.json`, cache);
      let body;
      try {
        body = JSON.parse(await readFile(cached, "utf8"));
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
        if (process.argv.includes("--offline"))
          throw new Error(`Missing cached source: ${url}`);
        const response = await fetch(url, {
          signal: AbortSignal.timeout(30000),
        });
        if (response.status === 404) body = null;
        else {
          if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
          body = Buffer.from(await response.arrayBuffer()).toString("utf8");
        }
        await writeFile(cached, JSON.stringify(body));
      }
      if (body === null) continue;
      const hash = createHash("sha256")
        .update(body.replace(/\r\n/g, "\n"))
        .digest("hex");
      const byHash = hashes.get(suffix);
      if (!byHash.has(hash)) byHash.set(hash, new Set());
      byHash.get(hash).add(version);
      const bySuffix = coverage.get(version);
      if (!bySuffix.has(suffix)) bySuffix.set(suffix, new Set());
      bySuffix.get(suffix).add(hash);
    }
  }),
);

for (const [version, assets] of coverage) {
  if (assets.size < 2)
    throw new Error(`Insufficient assets for ${version}: ${assets.size}`);
}
const compareVersions = (a, b) => a.localeCompare(b, "en", { numeric: true });
const fingerprints = [...hashes].map(([pathSuffix, byHash]) => ({
  pathSuffix,
  hashes: Object.fromEntries(
    [...byHash]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hash, versions]) => [hash, [...versions].sort(compareVersions)]),
  ),
}));
const output = new URL("src/signatures/fingerprints/basercms.ts", root);
await writeFile(
  output,
  await format(
    `// Generated from commit-pinned official sources; do not edit by hand.\n// Run: node scripts/generate_basercms_fingerprints.mjs\nimport type { AssetFingerprint } from "../_types.js";\n\nexport const baserCmsFingerprints: AssetFingerprint[] = ${JSON.stringify(fingerprints, null, 2)};\n`,
    { parser: "typescript" },
  ),
);
console.log(
  `Generated ${fileURLToPath(output)}: ${coverage.size} releases, ${fingerprints.length} asset paths, ${fingerprints.reduce((n, asset) => n + Object.keys(asset.hashes).length, 0)} hashes.`,
);
