# Whopper

A CLI tool that detects web technologies used by websites, similar to Wappalyzer or BuiltWith.

## Installation

You can install Whopper using npm:

```bash
npm install -g whopper
```

## Usage

To analyze a website, run the following command:

```bash
$ whopper

██╗    ████╗  ██╗██████╗██████╗██████╗█████████████╗
██║    ████║  ████╔═══████╔══████╔══████╔════██╔══██╗
██║ █╗ ███████████║   ████████╔██████╔█████╗ ██████╔╝
██║███╗████╔══████║   ████╔═══╝██╔═══╝██╔══╝ ██╔══██╗
╚███╔███╔██║  ██╚██████╔██║    ██║    █████████║  ██║
 ╚══╝╚══╝╚═╝  ╚═╝╚═════╝╚═╝    ╚═╝    ╚══════╚═╝  ╚═╝
                                               v0.1.0
Whopper - A web technology detection tool

Usage: whopper [options] [command]

A CLI tool that discovers and detects web technologies used on websites.

Options:
  -V, --version           output the version number
  -h, --help              display help for command

Commands:
  detect [options] <url>  Detects technologies used on the specified website URL.
  version                 Displays the current version of the CLI tool.
  help [command]          display help for command
```

This command will analyze the specified URL and output the detected technologies.

## Features

- Detects a wide range of web technologies including CMS, frameworks, libraries, and more.
- Provides detailed information about each detected technology.
- Easy-to-use command-line interface.
- Regularly updated technology database.
- Open-source and community-driven.

## Development

To contribute to Whopper, clone the repository and install the dependencies:

```bash
$ git clone https://github.com/0n1shi/whopper
$ cd whopper
$ npm install
$ npm link
```
