package signature

var KongaSignature = Signature{
	Name:        "Konga",
	Description: "An open source tool that enables you to manage your Kong API Gateway with ease.",
	Cpe:         "cpe:/a:konga_project:konga",

	DetectPattern: DetectPattern{
		Urls: []string{
			"konga",
		},
		Bodies: []string{
			"KONGA_CONFIG",
			"konga_version",
			"konga_settings",
		},
	},
	VersionPattern: VersionPattern{
		Bodies: []string{
			`konga_version = "(\d+\.\d+\.\d+)"`,
			`\.js\?r=(\d+\.\d+\.\d+)`,
		},
	},
}
