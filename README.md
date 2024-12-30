# <img src="./images/icon.png" width="50" height="50" /> Whopper

![Latest Tag](https://img.shields.io/github/v/tag/0n1shi/whopper?label=latest&sort=semver&color=blue)

THIS PROJECT IS STILL EXPERIMENTAL AND UNDER DEVELOPMENT 🚧

A simple, fast, and lightweight utility for uncovering the technology stack of a website.

```bash
$ whopper -h
NAME:
   whopper - A CLI tool to detect the technology stack used on a website

USAGE:
   whopper [global options] <http(s)://...>

GLOBAL OPTIONS:
   --debug, -d              debug mode (default: false)
   --level value, -l value  log level (debug | info | warn | error) (default: "info")
   --word value, -w value   search for a specific word in the response (url, body, headers) *skips the analysis
   --version, -v            print the version (default: false)
   --json, -j               output the result in JSON format (default: false)
   --help, -h               show help
```

## Install

```bash
go install github.com/0n1shi/whopper@latest
```

## Usage

### Detecting the technology stack of a website

```bash
$ whopper https://innerfreshshiningsunrise.neverssl.com/
2024/12/23 23:06:10 INFO starting ... url=https://shinyastoundingbrightmorning.neverssl.com/
2024/12/23 23:06:14 INFO navigating to the URL ...
2024/12/23 23:06:15 INFO page loaded
2024/12/23 23:06:18 INFO received responses count=3

[+] Apache 2.4.62
    > A free and open-source cross-platform web server, released under the terms of Apache License 2.0.
```

### Output in JSON format

```bash
$ whopper -j https://innerfreshshiningsunrise.neverssl.com/ 2> result.json
2024/12/23 23:06:10 INFO starting ... url=https://shinyastoundingbrightmorning.neverssl.com/
2024/12/23 23:06:14 INFO navigating to the URL ...
2024/12/23 23:06:15 INFO page loaded
2024/12/23 23:06:18 INFO received responses count=3

$ cat result.json | jq .
{
  "results": [
    {
      "name": "Apache",
      "description": "A free and open-source cross-platform web server, released under the terms of Apache License 2.0.",
      "versions": [
        "2.4.62"
      ],
      "cpes": [
        "cpe:/a:apache:http_server:2.4.62"
      ],
      "tags": [
        "#web-server",
        "#reverse-proxy"
      ]
    }
  ]
}
```

## Contributing

You can contribute like: https://github.com/0n1shi/whopper/pull/4

### Searching for a specific word in the responses (skipping the detection)

```bash
$ whopper -w Apache https://innerfreshshiningsunrise.neverssl.com/
2024/12/23 23:13:47 INFO starting ... url=https://shinyastoundingbrightmorning.neverssl.com/
2024/12/23 23:13:50 INFO navigating to the URL ...
2024/12/23 23:13:51 INFO page loaded
2024/12/23 23:13:54 INFO received responses count=3
2024/12/23 23:13:54 INFO searching for ... word=Apache
2024/12/23 23:13:54 INFO searching in URLs ...
2024/12/23 23:13:54 INFO searching in headers ...
URL: https://coolsereneclearmelody.neverssl.com/online/
        Server: Apache/2.4.62 ()
URL: https://coolsereneclearmelody.neverssl.com/favicon.ico
        Server: Apache/2.4.62 ()
URL: https://shinyastoundingbrightmorning.neverssl.com/
        Server: Apache/2.4.62 ()
2024/12/23 23:13:54 INFO searching in cookies ...
2024/12/23 23:13:54 INFO searching in bodies ...
2024/12/23 23:13:54 INFO skipping analysis because search word is set
```
