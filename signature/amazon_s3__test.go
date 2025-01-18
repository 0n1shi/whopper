package signature

import (
	"testing"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

func TestAmazonS3SignatureCheck(t *testing.T) {
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
		name: "Server header",
		response: &crawler.Response{
			Url: "http://example.com",
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
			Url: "http://other.com",
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "AmazonS3",
			}},
		},
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected, version := analyzer.Analyze(tt.response, &AmazonS3Signature, "example.com")
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
