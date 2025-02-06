package signature

var NginxSignature = Signature{
	Name:        "Nginx",
	Description: "An HTTP web server, reverse proxy, content cache, load balancer, TCP/UDP proxy server, and mail proxy server.",
	Cpe:         "cpe:/a:nginx:nginx",

	DetectPattern: DetectPattern{
		Headers: []Header{{
			Name:  "server",
			Value: "nginx",
		}},
	},
	VersionPattern: VersionPattern{
		Headers: []Header{{
			Name:  "server",
			Value: `nginx/(\d+\.\d+\.\d+)`,
		}},
	},

	OnlySameHost: true,
}
