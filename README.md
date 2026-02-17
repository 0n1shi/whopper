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

By default, detection is scoped to first-party resources (`--scope first-party`).
Use `--scope all` if you want to include third-party resources such as CDNs and embedded services.

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

To release a new version:

```bash
npm version patch  # or minor, major
git push --follow-tags
npm publish
```
