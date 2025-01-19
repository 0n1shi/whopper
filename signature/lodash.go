package signature

var LodashSignature = Signature{
	Name:        "Lodash",
	Description: "A modern JavaScript utility library delivering modularity, performance & extras.",
	Cpe:         "cpe:/a:lodash:lodash",

	DetectPattern: DetectPattern{
		Urls: []string{
			"lodash",
		},
		Bodies: []string{
			"lodash",
		},
	},
	VersionPattern: VersionPattern{
		Bodies: []string{
			`var VERSION = '(\d+\.\d+\.\d+)'`,
		},
	},
}
