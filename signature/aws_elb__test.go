package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestAwsElbSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No cookies",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "AWSALB cookie",
		response: &crawler.Response{
			BrowserURL: SameHostURL,
			URL:        SameHostURL,
			Cookies: []*crawler.Cookie{{
				Name:  "AWSALB",
				Value: "XyFb7cYWVbd39UCO3CbDi",
			}},
		},
		detected: true,
		version:  "",
	}, {
		name: "AWSALB cookie 2",
		response: &crawler.Response{
			BrowserURL: SameHostURL,
			URL:        SameHostURL,
			Cookies: []*crawler.Cookie{{
				Name:  "AWSELB",
				Value: "XyFb7cYWVbd39UCO3CbDi",
			}},
		},
		detected: true,
		version:  "",
	}, {
		name: "AWSALB cookie 3",
		response: &crawler.Response{
			BrowserURL: SameHostURL,
			URL:        SameHostURL,
			Cookies: []*crawler.Cookie{{
				Name:  "AWSALBCORS",
				Value: "XyFb7cYWVbd39UCO3CbDi",
			}},
		},
		detected: true,
		version:  "",
	}, {
		name: "AWSALB cookie 4",
		response: &crawler.Response{
			BrowserURL: SameHostURL,
			URL:        SameHostURL,
			Cookies: []*crawler.Cookie{{
				Name:  "AWSELBCORS",
				Value: "XyFb7cYWVbd39UCO3CbDi",
			}},
		},
		detected: true,
		version:  "",
	}, {
		name: "AWSALB HTTP header",
		response: &crawler.Response{
			BrowserURL: SameHostURL,
			URL:        SameHostURL,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "awselb/2.0",
			}},
		},
		detected: true,
		version:  "2.0",
	}}

	runTests(t, cases, &AwsElbSignature)
}
