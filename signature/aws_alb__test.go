package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestAwsAlbSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No cookies",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "AWSALB cookie",
		response: &crawler.Response{
			Url: SameHostUrl,
			Cookies: []*crawler.Cookie{{
				Name:  "AWSALB",
				Value: "XyFb7cYWVbd39UCO3CbDi",
			}},
		},
		detected: true,
		version:  "",
	}, {
		name: "AWSALB HTTP header",
		response: &crawler.Response{
			Url: SameHostUrl,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "awselb/2.0",
			}},
		},
		detected: true,
		version:  "2.0",
	}}

	runTests(t, cases, &AwsAlbSignature)
}
