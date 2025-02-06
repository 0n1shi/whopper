package signature

var UnpkgSignature = Signature{
	Name:        "UNPKG",
	Description: "unpkg is a fast, global content delivery network for everything on npm.",
	Cpe:         "",

	DetectPattern: DetectPattern{
		Bodies: []string{
			"unpkg.com/",
		},
	},

	OnlySameHost: true,
}
