package signature

var AkamaiBotManagerSignature = Signature{
	Name:        "Akamai Bot Manager",
	Description: "Akamai Bot Manager is a cloud-based service that protects websites from bots and web scraping.",
	Cpe:         "",

	DetectPattern: DetectPattern{
		Cookies: []Cookie{{
			Name: "bm_sz",
		}},
	},

	OnlySameHost: true,
}
