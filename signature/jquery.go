package signature

var JQuerySignature = Signature{
	Name:        "jQuery",
	Description: "A fast, small, and feature-rich JavaScript library.",
	Cpe:         "cpe:/a:jquery:jquery",

	DetectPattern: DetectPattern{
		Urls: []string{
			"jquery",
		},
		Bodies: []string{
			"jquery",
			"jQuery",
		},
	},
	VersionPattern: VersionPattern{
		Urls: []string{
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
