package signature

var WordpressSignature = Signature{
	Name:        "WordPress",
	Description: "WordPress is a free and open-source content management system (CMS) written in PHP and paired with a MySQL or MariaDB database. Features include a plugin architecture and a template system, referred to within WordPress as Themes.",
	Cpe:         "cpe:/a:wordpress:wordpress",

	DetectPattern: DetectPattern{
		Bodies: []string{
			"WordPress",
		},
	},
	VersionPattern: VersionPattern{
		Bodies: []string{
			`WordPress (\d+\.\d+\.\d+)`,
		},
	},

	OnlySameHost: true,
}
