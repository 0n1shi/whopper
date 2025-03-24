package signature

var JQueryBxSliderSignature = Signature{
	Name:        "jQuery bxSlider",
	Description: "bxSlider is a fully responsive jQuery content slider.",
	Cpe:         "cpe:/a:bxslider:bxslider",

	DetectPattern: DetectPattern{
		URLs: []string{
			"bxslider",
		},
		Bodies: []string{
			"bxSlider",
		},
	},
	VersionPattern: VersionPattern{
		URLs: []string{
			`bxslider/(\d+\.\d+\.\d+)/`,
		},
		Bodies: []string{
			`\* bxSlider v(\d+\.\d+\.\d+)`,
		},
	},
}
