package signature

import (
	"github.com/0n1shi/whopper/analyzer"
)

var AmazonCloudFrontSignature = analyzer.Signature{
	Name:        "Amazon CloudFront",
	Description: "A fast content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally with low latency, high transfer speeds, all within a developer-friendly environment.",
	Cpe:         "",

	HeaderSignatures: []analyzer.HeaderSignature{{
		Name:        "via",
		ValueRegexp: `\.cloudfront\.net \(CloudFront\)`,
	}, {
		Name:        "x-cache",
		ValueRegexp: `from cloudfront`,
	}},

	OnlySameHost: true,
}
