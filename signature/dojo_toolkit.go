package signature

import (
	"regexp"

	"github.com/0n1shi/whopper/crawler"
)

var DojoToolkitSignature = Signature{
	Name:        "Dojo Toolkit",
	Description: "A fast, small, and feature-rich JavaScript library.",
	Cpe:         "cpe:/a:dojo:dojo_toolkit",

	DetectPattern: DetectPattern{
		URLs: []string{
			"dojo.js",
		},
		Bodies: []string{
			"dojotoolkit",
			"dojo.version",
		},
	},
	VersionFuncs: []VersionFunc{
		func(res *crawler.Response) string {
			matches := regexp.MustCompile(`dojo\.version={major:(\d+),minor:(\d+),patch:(\d+),`).FindStringSubmatch(res.Body)
			if len(matches) > 3 {
				return matches[1] + "." + matches[2] + "." + matches[3]
			}
			return ""
		},
	},
}
