package signature

var OpenSSLSignature = Signature{
	Name:        "OpenSSL",
	Description: "OpenSSL is a software library for applications that provide secure communications over computer networks.",
	Cpe:         "cpe:/a:openssl:openssl",

	DetectPattern: DetectPattern{
		Headers: []Header{{
			Name:  "server",
			Value: "OpenSSL",
		}},
	},
	VersionPattern: VersionPattern{
		Headers: []Header{{
			Name:  "server",
			Value: `OpenSSL/(\d+\.\d+\.\d+[a-zA-Z]?)`,
		}},
	},

	OnlySameHost: true,
}
