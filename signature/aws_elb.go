package signature

var AwsElbSignature = Signature{
	Name:        "AWS ELB",
	Description: "Elastic Load Balancing automatically distributes incoming application traffic across multiple targets, such as Amazon EC2 instances, containers, IP addresses, and Lambda functions.",
	Cpe:         "",

	DetectPattern: DetectPattern{
		Headers: []Header{{
			Name:  "server",
			Value: `awselb`,
		}},
		Cookies: []Cookie{{
			Name: "AWSALB",
		}, {
			Name: "AWSALBCORS",
		}, {
			Name: "AWSELB",
		}, {
			Name: "AWSELBCORS",
		}},
	},
	VersionPattern: VersionPattern{
		Headers: []Header{{
			Name:  "server",
			Value: `awselb/(\d+\.\d+)`,
		}},
	},

	OnlySameHost: true,
}
