package signature

var BackboneJsSignature = Signature{
	Name:        "Backbone.js",
	Description: "Backbone.js is a JavaScript rich-client web app framework based on the model–view–controller design paradigm, intended to connect to an API over a RESTful JSON interface.",
	Cpe:         "cpe:/a:backbone_project:backbone",

	DetectPattern: DetectPattern{
		Bodies: []string{
			`Backbone.history has already been started`,
			`t.VERSION="(\d+\.\d+\.\d+)"`,
		},
	},
	VersionPattern: VersionPattern{
		Bodies: []string{
			`t.VERSION="(\d+\.\d+\.\d+)"`,
		},
	},
}
