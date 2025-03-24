package signature

var JQuerySignature = Signature{
	Name:        "jQuery",
	Description: "A fast, small, and feature-rich JavaScript library.",
	Cpe:         "cpe:/a:jquery:jquery",

	DetectPattern: DetectPattern{
		URLs: []string{
			"jquery",
		},
		Bodies: []string{
			"jquery",
			"jQuery",
		},
	},
	VersionPattern: VersionPattern{
		URLs: []string{
			`jquery[@/-](\d+\.\d+\.\d+)`,
		},
		Bodies: []string{
			`jQuery v(\d+\.\d+\.\d+)`,
			`jQuery JavaScript Library v(\d+\.\d+\.\d+)`,
			`var C="(\d+\.\d+\.\d+)"`,
			`d="(\d+\.\d+\.\d+)"`,
		},
	},
}
