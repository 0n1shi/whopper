package signature

var AspDotNetSignature = Signature{
	Name:        "ASP.NET",
	Description: "ASP.NET is an open-source server-side web application framework designed for web development to produce dynamic web pages.",
	Cpe:         "cpe:/a:microsoft:asp.net_core",

	DetectPattern: DetectPattern{
		Headers: []Header{{
			Name:  "x-powered-by",
			Value: "ASP.NET",
		}, {
			Name:  "set-cookie",
			Value: "ASP.NET_SessionId",
		}, {
			Name: "x-aspnet-version",
		}},
		Cookies: []Cookie{{
			Name: `ASP.NET_SessionId`,
		}},
	},
	VersionPattern: VersionPattern{
		Headers: []Header{{
			Name:  "x-aspnet-version",
			Value: `(\d+\.\d+\.\d+)`,
		}},
	},

	OnlySameHost: true,
}
