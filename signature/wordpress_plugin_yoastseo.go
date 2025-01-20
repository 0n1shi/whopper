package signature

var WordpressPluginYoastSEOSignature = Signature{
	Name:        "WordPress Plugin - Yoast SEO",
	Description: "Improve your WordPress SEO: Write better content and have a fully optimized WordPress site using the Yoast SEO plugin.",
	Cpe:         "cpe:/a:yoast:yoast_seo",

	DetectPattern: DetectPattern{
		Bodies: []string{
			"<!-- This site is optimized with the Yoast SEO plugin",
		},
	},
	VersionPattern: VersionPattern{
		Bodies: []string{
			`<!-- This site is optimized with the Yoast SEO plugin v(\d+\.\d+) -`,
		},
	},
}
