package signature

var ApacheSignature = Signature{
	Name:        "Apache HTTP Server",
	Description: "Apache is a free and open-source cross-platform web server software.",
	Cpe:         "cpe:/a:apache:http_server",
	DetectPattern: DetectPattern{
		Headers: []Header{{
			Name:  "server",
			Value: "Apache",
		}},
	},
	VersionPattern: VersionPattern{
		Headers: []Header{{
			Name:  "server",
			Value: `Apache/(\d+\.\d+\.\d+)`,
		}},
	},
	OnlySameHost: true,
}
