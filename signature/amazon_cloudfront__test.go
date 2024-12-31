package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestAmazonCloudFrontSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		expected bool
		version  string
	}{{
		name:     "No headers",
		response: &crawler.Response{},
		expected: false,
		version:  "",
	}, {
		name: "Via header",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "via",
				Value: "1.1 1234567890abcdef.cloudfront.net (CloudFront)",
			}},
		},
		expected: true,
		version:  "",
	}, {
		name: "X-Cache header",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "x-cache",
				Value: "Hit from cloudfront",
			}},
		},
		expected: true,
		version:  "",
	}, {
		name: "x-cache header 2",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "x-cache",
				Value: "Miss from cloudfront",
			}},
		},
		expected: true,
		version:  "",
	}}

	for _, tt := range tests {
		s := &AmazonCloudFrontSignature{}
		t.Run(tt.name, func(t *testing.T) {
			if got := s.Check(tt.response); got != tt.expected {
				t.Errorf("Check() = %v, want %v", got, tt.expected)
			}
			if got := s.Version(tt.response); got != tt.version {
				t.Errorf("Version() = %v, want %v", got, tt.version)
			}
		})
	}
}
