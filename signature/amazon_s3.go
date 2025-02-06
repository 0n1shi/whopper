package signature

var AmazonS3Signature = Signature{
	Name:        "Amazon S3",
	Description: "Cloud Object Storage — Experience Reliability & Scalability With AWS Online Storage Solutions.",
	Cpe:         "",

	DetectPattern: DetectPattern{
		Headers: []Header{{
			Name:  "server",
			Value: `AmazonS3`,
		}},
	},

	OnlySameHost: true,
}
