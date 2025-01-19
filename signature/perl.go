package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

var PerlSignature = Signature{
	Name:        "Perl",
	Description: "Perl is a highly capable, feature-rich programming language with over 37 years of development.",
	Cpe:         "cpe:/a:perl:perl",

	DetectPattern: DetectPattern{
		Headers: []Header{{
			Name:  "server",
			Value: "Perl",
		}},
	},
	VersionPattern: VersionPattern{
		Headers: []Header{{
			Name:  "server",
			Value: `Perl/v?(\d+\.\d+\.\d+)`,
		}},
	},

	OnlySameHost: true,
}
