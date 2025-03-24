package signature

var UnderscoreSignature = Signature{
	Name:        "Underscore.js",
	Description: "A JavaScript library that provides a whole mess of useful functional programming helpers without extending any built-in objects.",
	Cpe:         "cpe:/a:underscorejs:underscore",

	DetectPattern: DetectPattern{
		URLs: []string{
			"underscore",
		},
		Bodies: []string{
			"Underscore.js",
		},
	},
	VersionPattern: VersionPattern{
		Bodies: []string{
			`Underscore\.js (\d+\.\d+\.\d+)`,
		},
	},
}
