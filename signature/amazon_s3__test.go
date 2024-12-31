package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestAmazonS3SignatureCheck(t *testing.T) {
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
		name: "Server header",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "AmazonS3",
			}},
		},
		expected: true,
		version:  "",
	}}

	for _, tt := range tests {
		s := &AmazonS3Signature{}
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
