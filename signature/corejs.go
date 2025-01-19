package signature

var CoreJsSignature = Signature{
	Name:        "core-js",
	Description: "Modular standard library for JavaScript.",
	Cpe:         "",

	DetectPattern: DetectPattern{
		Bodies: []string{
			"github.com/zloirock/core-js",
		},
	},
	VersionPattern: VersionPattern{
		Bodies: []string{
			`https://github.com/zloirock/core-js/blob/v(\d+\.\d+\.\d+)/LICENSE`,
		},
	},
}
