package signature

var AwsAlbSignature = Signature{
	Name:        "AWS ALB (Application Load Balancer)",
	Description: "Load balance HTTP and HTTPS traffic with advanced request routing targeted at the delivery of modern applications.",
	Cpe:         "",

	DetectPattern: DetectPattern{
		Headers: []Header{{
			Name:  "server",
			Value: `awselb/(\d+\.\d+)`,
		}},
		Cookies: []Cookie{{
			Name: "AWSALB",
		}},
	},
}
