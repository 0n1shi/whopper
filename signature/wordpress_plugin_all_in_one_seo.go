package signature

var WordpressPluginAllInOneSEOSignature = Signature{
	Name:        "WordPress Plugin - All in One SEO Pack",
	Description: "The original WordPress SEO plugin, downloaded over 65,000,000 times since 2007.",
	Cpe:         "cpe:/a:semperfiwebdesign:all_in_one_seo_pack",

	DetectPattern: DetectPattern{
		Bodies: []string{
			"All in One SEO",
		},
	},
	VersionPattern: VersionPattern{
		Bodies: []string{
			`All in One SEO (\d+\.\d+\.\d+)`,
			`All in One SEO \(AIOSEO\) (\d+\.\d+\.\d+)`,
		},
	},
}
