package signature

import (
	"github.com/0n1shi/whopper/analyzer"
)

var AwsAlbSignature = analyzer.Signature{
	Name:        "AWS ALB (Application Load Balancer)",
	Description: "Load balance HTTP and HTTPS traffic with advanced request routing targeted at the delivery of modern applications.",
	Cpe:         "",

	HeaderSignatures: []analyzer.HeaderSignature{{
		Name:        "server",
		ValueRegexp: `awselb/?(\d+\.\d+)?`,
	}},
	CookieSignatures: []analyzer.CookieSignature{{
		Name:        "AWSALB",
		ValueRegexp: `^.*$`,
	}},
}
