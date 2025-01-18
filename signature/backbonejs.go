package signature

import (
	"github.com/0n1shi/whopper/analyzer"
)

var BackboneJsSignature = analyzer.Signature{
	Name:        "Backbone.js",
	Description: "Backbone.js is a JavaScript rich-client web app framework based on the model–view–controller design paradigm, intended to connect to an API over a RESTful JSON interface.",
	Cpe:         "cpe:/a:backbone_project:backbone",

	BodyRegexps: []string{
		`Backbone.history has already been started`,
		`t.VERSION="(\d+\.\d+\.\d+)"`,
	},
}
