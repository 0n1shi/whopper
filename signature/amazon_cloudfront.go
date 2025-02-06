package signature

var AmazonCloudFrontSignature = Signature{
	Name:        "Amazon CloudFront",
	Description: "A fast content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally with low latency, high transfer speeds, all within a developer-friendly environment.",
	Cpe:         "",

	DetectPattern: DetectPattern{
		Headers: []Header{{
			Name:  "via",
			Value: `\.cloudfront\.net \(CloudFront\)`,
		}, {
			Name:  "x-cache",
			Value: `from cloudfront`,
		}},
	},

	OnlySameHost: true,
}
