package signature

var JQueryUiSignature = Signature{
	Name:        "jquery-ui",
	Description: "jQuery UI is a curated set of user interface interactions, effects, widgets, and themes built on top of the jQuery JavaScript Library.",
	Cpe:         "cpe:/a:jqueryui:jquery_ui",

	DetectPattern: DetectPattern{
		Bodies: []string{
			"jQuery UI CSS Framework",
		},
	},
	VersionPattern: VersionPattern{
		Bodies: []string{
			`jQuery UI CSS Framework (\d+\.\d+\.\d+)`,
		},
	},
}
