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
