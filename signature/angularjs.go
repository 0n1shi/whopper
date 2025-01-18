package signature

import (
	"github.com/0n1shi/whopper/analyzer"
)

var AngularJsSignature = analyzer.Signature{
	Name:        "AngularJS",
	Description: "A discontinued free and open-source JavaScript-based web framework for developing single-page applications.",
	Cpe:         "cpa:/a:angularjs:angular.js",

	BodyRegexps: []string{
		`angular`,
		`\* @license AngularJS v?(\d+\.\d+\.\d+)?`,
		`http:\/\/errors.angularjs.org\/(\d+\.\d+\.\d+(-rc\.\d+)?)?`,
	},
	UrlRegexps: []string{
		`/angular-`,
	},

	OnlySameHost: false,
}
