package signature

import (
	"github.com/0n1shi/whopper/analyzer"
)

var BootstrapSignature = analyzer.Signature{
	Name:        "Bootstrap",
	Description: "Powerful, extensible, and feature-packed frontend toolkit. Build and customize with Sass, utilize prebuilt grid system and components, and bring projects to life with powerful JavaScript plugins.",
	Cpe:         "cpe:/a:getbootstrap:bootstrap",

	UrlRegexps: []string{
		"/bootstrap/",
		"/bootstrap.min.css",
		"/bootstrap.min.js",
		`/bootstrap/(\d+\.\d+\.\d+)?`,
	},
	BodyRegexps: []string{
		`\* Bootstrap v(\d+\.\d+\.\d+)`,
	},
}
