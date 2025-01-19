package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

const (
	microsoftClarityfileName = "clarity.js"
	microsoftClarityBanner   = "/* clarity-js"
)

var ClaritySignature = Signature{
	Name:        "Microsoft Clarity",
	Description: "Clarity is a free product that captures how people use your site. Setup is easy and you'll start getting data in minutes.",
	Cpe:         "cpe:/a:microsoft:clarity",

	DetectPattern: DetectPattern{
		Urls: []string{
			"clarity.js",
		},
		Bodies: []string{
			"clarity-js",
		},
	},
	VersionPattern: VersionPattern{
		Urls: []string{
			`www\.clarity\.ms\/s\/(\d+\.\d+\.\d+)\/clarity\.js`,
		},
		Bodies: []string{
			`/\* clarity-js v([0-9.]+):`,
		},
	},
}
