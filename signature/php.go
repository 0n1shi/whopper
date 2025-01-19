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
	},
	VersionPattern: VersionPattern{
		Headers: []Header{{
			Name:  "server",
			Value: `PHP/(\d+\.\d+\.\d+)`,
		}},
	},

	OnlySameHost: true,
}
