package signature

import (
	"github.com/0n1shi/whopper/analyzer"
)

var AngularJsSignature = analyzer.Signature{
	Name:        "AngularJS",
	Description: "A discontinued free and open-source JavaScript-based web framework for developing single-page applications.",
	Cpe:         "cpa:/a:angularjs:angular.js",

	DetectRegexp: analyzer.DetectRegexp{
		BodyRegexps: []string{
			`angular`,
		},
		UrlRegexps: []string{
			`/angular-`,
		},
	},
	VersionRegexp: analyzer.VersionRegexp{
		BodyRegexps: []string{
			`\* @license AngularJS v(\d+\.\d+\.\d+)`,
			`http:\/\/errors.angularjs.org\/(\d+\.\d+\.\d+(-rc\.\d+)?)`,
		},
	},

	OnlySameHost: false,
}
