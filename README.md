# Whopper

[![npm version](https://img.shields.io/npm/v/whopper?color=blue)](https://www.npmjs.com/package/whopper)
[![codecov](https://codecov.io/gh/0n1shi/whopper/graph/badge.svg)](https://codecov.io/gh/0n1shi/whopper)

A CLI tool that detects web technologies used by websites, similar to Wappalyzer or BuiltWith.

## 📦 Installation

You can install Whopper using npm:

```bash
npm install -g whopper
```

## 🚀 Usage

To analyze a website, run the following command:

```bash
$ whopper

██╗    ████╗  ██╗██████╗██████╗██████╗█████████████╗
██║    ████║  ████╔═══████╔══████╔══████╔════██╔══██╗
██║ █╗ ███████████║   ████████╔██████╔█████╗ ██████╔╝
██║███╗████╔══████║   ████╔═══╝██╔═══╝██╔══╝ ██╔══██╗
╚███╔███╔██║  ██╚██████╔██║    ██║    █████████║  ██║
 ╚══╝╚══╝╚═╝  ╚═╝╚═════╝╚═╝    ╚═╝    ╚══════╚═╝  ╚═╝

Whopper - A web technology detection tool

Usage: whopper [options] [command]

A CLI tool that discovers and detects web technologies used on websites.

Options:
  -v, --version           output the version number
  -h, --help              display help for command

Commands:
  detect [options] <url>  Detects technologies used on the specified website URL.
  help [command]          display help for command
```

This command will analyze the specified URL and output the detected technologies.

Detection uses smart filtering by default:
- Client-side third-party resources (for example CDN-hosted JS/CSS libraries) are included.
- Third-party server-side hints (for example response headers and cookies) are excluded.

### baserCMS version fingerprinting

`whopper detect https://example.com/ --active --json` also fingerprints baserCMS
when its passive markers are detected. It checks the default `/baser/admin/`
(5.x) and `/admin/` (4.x) login pages, then compares the linked, same-origin
admin JS/CSS against hashes from official releases. It needs no login credentials.
Custom admin prefixes and subdirectory installations with different login URLs
are not probed. Without `--active`, presence detection is unchanged.

Two or more distinct asset paths must agree on a single release before Whopper
reports an inferred `version` with medium confidence. Otherwise matching releases
are returned as `versionCandidates` and corresponding `cpeCandidates` for
vulnerability lookups, while the singular `version` and `cpe` remain unset.
For example, candidates `5.4.0` and `5.4.1` produce
`cpe:/a:basercms:basercms:5.4.0` and `cpe:/a:basercms:basercms:5.4.1`.
Unrecognized asset contents or conflicting matches suppress version inference.
Requests are limited to eight known asset URLs, with a shared fingerprint timeout;
cross-origin asset URLs and redirects are blocked.

The dictionary covers the official 4.x/5.x tags listed in
[`scripts/basercms_sources.json`](scripts/basercms_sources.json), including
four-part patch versions. Shared files cannot distinguish every patch release.
Rebuilt/customized themes, stale assets, independently updated packages, and
releases outside the dictionary can prevent or mislead inference; a fingerprint
is not proof of the installed PHP code or a vulnerability's presence.

To discover new stable 4.x/5.x tags and regenerate the dictionary, run:

```bash
npm ci
node scripts/generate_basercms_fingerprints.mjs --update-sources
```

New tags are resolved to full commit SHAs before downloading; existing pins are
never silently changed. A moved upstream tag fails the update for manual review.
Set `GH_TOKEN` to use authenticated GitHub API requests when discovering tags.
Omit `--update-sources` to regenerate only the currently registered releases.
The generator downloads only the selected assets, normalizes CRLF to LF, and
hashes their UTF-8 text with SHA-256. Downloads are cached in `.cache/basercms/`;
`--offline` regenerates from that cache. Commit the manifest and generated
`src/signatures/fingerprints/basercms.ts` together. Tests do not contact GitHub
or scan external hosts.

The **Update baserCMS fingerprints** workflow checks weekly on Monday at
00:23 UTC (09:23 JST), and also supports manual dispatch on the default branch.
When there is a diff, it runs tests, build, and lint, then creates or updates one
PR on `chore/update-basercms-fingerprints`. No diff means no new PR; merging is
manual. The schedule starts after the workflow is merged into the default branch.

Enable **Settings > Actions > General > Workflow permissions > Allow GitHub
Actions to create and approve pull requests** for automated PR creation. No PAT
is required: the workflow uses `GITHUB_TOKEN`. PRs created with that token do not
trigger the separate PR test workflow, which is why validation runs before PR
creation. See the [action's permissions documentation](https://github.com/peter-evans/create-pull-request#workflow-permissions).

## ✨ Features

- Detects a wide range of web technologies including CMS, frameworks, libraries, and more.
- Provides detailed information about each detected technology.
- Easy-to-use command-line interface.
- Regularly updated technology database.
- Open-source and community-driven.

## 🛠️ Development

To contribute to Whopper, clone the repository and install the dependencies:

```bash
git clone https://github.com/0n1shi/whopper
cd $_
npm install
npm link
```

### Releasing a New Version

Use one of the bundled release scripts. They take care of version-bumping, tag-pushing, and publishing in a single command:

```bash
npm run release:patch   # bug fixes (e.g. 0.5.5 -> 0.5.6)
npm run release:minor   # backwards-compatible features (0.5.5 -> 0.6.0)
npm run release:major   # breaking changes (0.5.5 -> 1.0.0)
```

If the version was already bumped (e.g. by an earlier `npm version`) and you just need to push & publish:

```bash
npm run release         # git push --follow-tags && npm publish
```

Every `npm publish` automatically triggers the `prepublishOnly` hook, which runs `clean → lint → test → build` so the published tarball always contains a freshly built `dist/`. Direct `npm publish` is therefore safe as well — the release scripts mainly bundle the version bump and tag push.
