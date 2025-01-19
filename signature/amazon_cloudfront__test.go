package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestAmazonCloudFrontSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No headers",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "Via header",
		response: &crawler.Response{
			Url: "http://example.com",
			Headers: []*crawler.Header{{
				Name:  "via",
				Value: "1.1 1234567890abcdef.cloudfront.net (CloudFront)",
			}},
		},
		detected: true,
		version:  "",
	}, {
		name: "X-Cache header",
		response: &crawler.Response{
			Url: "http://example.com",
			Headers: []*crawler.Header{{
				Name:  "x-cache",
				Value: "Hit from cloudfront",
			}},
		},
		detected: true,
		version:  "",
	}, {
		name: "x-cache header 2",
		response: &crawler.Response{
			Url: "http://example.com",
			Headers: []*crawler.Header{{
				Name:  "x-cache",
				Value: "Miss from cloudfront",
			}},
		},
		detected: true,
		version:  "",
	}, {
		name: "x-cache header 3 but different host",
		response: &crawler.Response{
			Url: "http://other.com",
			Headers: []*crawler.Header{{
				Name:  "x-cache",
				Value: "Error from cloudfront",
			}},
		},
		detected: false,
		version:  "",
	}}

	runTests(t, cases, &AmazonCloudFrontSignature)
}
