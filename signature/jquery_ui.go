package signature

var JQueryUiSignature = Signature{
	Name:        "jquery-ui",
	Description: "jQuery UI is a curated set of user interface interactions, effects, widgets, and themes built on top of the jQuery JavaScript Library.",
	Cpe:         "cpe:/a:jqueryui:jquery_ui",

	DetectPattern: DetectPattern{
		URLs: []string{
			"jquery-ui",
		},
		Bodies: []string{
			"jQuery UI CSS Framework",
			"/*! jQuery UI",
		},
	},
	VersionPattern: VersionPattern{
		URLs: []string{
			`jquery-ui-(\d+\.\d+\.\d+)`,
		},
		Bodies: []string{
			`jQuery UI CSS Framework (\d+\.\d+\.\d+)`,
			`/*! jQuery UI - v(\d+\.\d+\.\d+)`,
		},
	},
}
