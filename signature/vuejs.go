package signature

var VueJsSignature = Signature{
	Name:        "Vue.js",
	Description: "Vue.js is a progressive JavaScript framework for building user interfaces.",
	Cpe:         "cpe:/a:vuejs:vuejs",

	DetectPattern: DetectPattern{
		URLs: []string{
			"/vue.js",
			"/vue.min.js",
		},
		Bodies: []string{
			"Vue.js",
		},
	},
	VersionPattern: VersionPattern{
		Bodies: []string{
			"Vue.js v(\\d+\\.\\d+\\.\\d+)",
			"version=\"(\\d+\\.\\d+\\.\\d+)\"",
			"vue v(\\d+\\.\\d+\\.\\d+)",
		},
	},
}
