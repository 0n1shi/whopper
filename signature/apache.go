package signature

import (
	"github.com/0n1shi/whopper/analyzer"
)

var ApacheSignature = analyzer.Signature{
	Name:        "Apache",
	Description: "Apache is a free and open-source cross-platform web server software.",
	Cpe:         "cpe:/a:apache:http_server",
	HeaderSignatures: []analyzer.HeaderSignature{{
		Name:        "server",
		ValueRegexp: `Apache/?(\d+\.\d+\.\d+)?`,
	}},
	OnlySameHost: true,
}
