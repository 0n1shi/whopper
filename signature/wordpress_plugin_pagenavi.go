package signature

var WordpressPluginPageNaviSignature = Signature{
	Name:        "WordPress Plugin - WP-PageNavi",
	Description: "Want to replace the old ← Older posts | Newer posts → links with some page links? This plugin provides the wp_pagenavi() template tag which generates fancy pagination links.",

	DetectPattern: DetectPattern{
		URLs: []string{
			"/plugins/wp-pagenavi",
		},
		Bodies: []string{
			"for WP-PageNavi plugin",
		},
	},
	VersionPattern: VersionPattern{
		URLs: []string{
			`/plugins/wp-pagenavi/pagenavi-css\.css\?ver=([0-9.]+)`,
		},
	},
}
