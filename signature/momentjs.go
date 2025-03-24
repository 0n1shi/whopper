package signature

var MomentJsSignature = Signature{
	Name:        "Moment.js",
	Description: "Parse, validate, manipulate, and display dates and times in JavaScript.",
	Cpe:         "cpe:/a:jqueryui:jquery_ui",

	DetectPattern: DetectPattern{
		URLs: []string{
			"moment",
		},
		Bodies: []string{
			"moment",
		},
	},
	VersionPattern: VersionPattern{
		Bodies: []string{
			`//! version : (\d+\.\d+\.\d+)`,
			`VERSION = '(\d+\.\d+\.\d+)'`,
			`b.version="(\d+\.\d+\.\d+)"`,
		},
	},
}
