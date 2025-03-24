package signature

var BootstrapSignature = Signature{
	Name:        "Bootstrap",
	Description: "Powerful, extensible, and feature-packed frontend toolkit. Build and customize with Sass, utilize prebuilt grid system and components, and bring projects to life with powerful JavaScript plugins.",
	Cpe:         "cpe:/a:getbootstrap:bootstrap",

	DetectPattern: DetectPattern{
		URLs: []string{
			"/bootstrap/",
			"/bootstrap.min.css",
			"/bootstrap.min.js",
		},
		Bodies: []string{
			`Bootstrap`,
		},
	},
	VersionPattern: VersionPattern{
		URLs: []string{
			`/bootstrap/(\d+\.\d+\.\d+)`,
		},
		Bodies: []string{
			`\* Bootstrap v(\d+\.\d+\.\d+)`,
		},
	},
}
