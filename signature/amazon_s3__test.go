package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestAmazonS3Signature(t *testing.T) {
	cases := []TestCase{{
		name:     "No headers",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "Server header",
		response: &crawler.Response{
			BrowserURL: SameHostURL,
			URL:        SameHostURL,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "AmazonS3",
			}},
		},
		detected: true,
		version:  "",
	}, {
		name: "Server header but different host",
		response: &crawler.Response{
			BrowserURL: SameHostURL,
			URL:        OtherHostURL,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "AmazonS3",
			}},
		},
		detected: false,
		version:  "",
	}}

	runTests(t, cases, &AmazonS3Signature)
}
