package signature

import (
	"github.com/0n1shi/whopper/analyzer"
)

var AmazonS3Signature = analyzer.Signature{
	Name:        "Amazon S3",
	Description: "Cloud Object Storage — Experience Reliability & Scalability With AWS Online Storage Solutions.",
	Cpe:         "",

	HeaderSignatures: []analyzer.HeaderSignature{{
		Name:        "server",
		ValueRegexp: `AmazonS3`,
	}},
	OnlySameHost: true,
}
