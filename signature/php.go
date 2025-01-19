package signature

var PhpSignature = Signature{
	Name:        "PHP",
	Description: "A general-purpose scripting language geared towards web development.",
	Cpe:         "cpe:/a:php:php",

	DetectPattern: DetectPattern{
		Headers: []Header{{
			Name:  "server",
			Value: "PHP",
		}, {
			Name:  "x-powered-by",
			Value: "PHP",
		}},
		Bodies: []string{
			`\.php`,
			`<\?php`,
		},
	},
	VersionPattern: VersionPattern{
		Headers: []Header{{
			Name:  "server",
			Value: `PHP/(\d+\.\d+\.\d+)`,
		}, {
			Name:  "x-powered-by",
			Value: `PHP/(\d+\.\d+\.\d+)`,
		}},
	},

	OnlySameHost: true,
}
