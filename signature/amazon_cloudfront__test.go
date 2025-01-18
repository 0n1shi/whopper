package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestAmazonCloudFrontSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		detected bool
		version  string
	}{{
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

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected := Detect(tt.response, &AmazonCloudFrontSignature, "example.com")
			version := ExtractVersion(tt.response, &AmazonCloudFrontSignature)
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %q, want %q", version, tt.version)
			}
		})
	}
}
