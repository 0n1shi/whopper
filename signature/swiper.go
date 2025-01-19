package signature

var SwiperSignature = Signature{
	Name:        "Swiper",
	Description: "Most modern mobile touch slider and framework with hardware accelerated transitions.",
	Cpe:         "cpe:/a:swiperjs:swiper",

	DetectPattern: DetectPattern{
		Urls: []string{
			"npm/swiper@",
		},
		Bodies: []string{
			"* Swiper ",
		},
	},
	VersionPattern: VersionPattern{
		Urls: []string{
			`npm/swiper@(\d+\.\d+\.\d+)/`,
		},
		Bodies: []string{
			`* Swiper (\d+\.\d+\.\d+)`,
		},
	},
}
