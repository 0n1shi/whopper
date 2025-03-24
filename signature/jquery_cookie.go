package signature

var JQueryCookieSignature = Signature{
	Name:        "jQuery Cookie",
	Description: "A simple, lightweight jQuery plugin for reading, writing and deleting cookies.",
	Cpe:         "cpe:/a:jquery.cookie_project:jquery.cookie",

	DetectPattern: DetectPattern{
		URLs: []string{
			"jquery-cookie",
		},
		Bodies: []string{
			"jQuery Cookie Plugin",
		},
	},
	VersionPattern: VersionPattern{
		URLs: []string{
			`jquery-cookie[@/](\d+\.\d+\.\d+)`,
		},
		Bodies: []string{
			`jQuery Cookie Plugin v(\d+\.\d+)`,
		},
	},
}
