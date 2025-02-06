package signature

var ModPerlSignature = Signature{
	Name:        "mod_perl",
	Description: "mod_perl brings together the full power of the Perl programming language and the Apache HTTP server.",
	Cpe:         "cpe:/a:apache:mod_perl",

	DetectPattern: DetectPattern{
		Headers: []Header{{
			Name:  "server",
			Value: "mod_perl",
		}},
	},
	VersionPattern: VersionPattern{
		Headers: []Header{{
			Name:  "server",
			Value: `mod_perl/(\d+\.\d+\.\d+)`,
		}},
	},

	OnlySameHost: true,
}
