package signature

var JQueryMigrateSignature = Signature{
	Name:        "jQuery Migrate",
	Description: "jQuery Migrate makes older code compatible with jQuery 3.0+.",
	Cpe:         "cpe:/a:jquery_migrate_project:jquery_migrate",

	DetectPattern: DetectPattern{
		Urls: []string{
			"jquery-migrate",
		},
		Bodies: []string{
			"jQuery Migrate",
			"jQuery.migrate",
		},
	},
	VersionPattern: VersionPattern{
		Urls: []string{
			`jquery-migrate\.min\.js\?ver=(\d+\.\d+\.\d+)`,
		},
		Bodies: []string{
			`jQuery Migrate v(\d+\.\d+\.\d+)`,
		},
	},
}
