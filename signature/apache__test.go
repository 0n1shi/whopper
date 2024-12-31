package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestApacheSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		expected bool
		version  string
	}{{
		name: "No headers",
		response: &crawler.Response{
			Headers: []*crawler.Header{},
		},
		expected: false,
		version:  "",
	}, {
		name: "Server header",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache",
			}},
		},
		expected: true,
		version:  "",
	}, {
		name: "Server header with version",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.4.29 (Ubuntu)",
			}},
		},
		expected: true,
		version:  "2.4.29",
	}, {
		name: "Server header with version and other info",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.4.29 (Ubuntu) PHP/7.2.24-0ubuntu0.18.04.7",
			}},
		},
		expected: true,
		version:  "2.4.29",
	}, {
		name: "Server header (Nginx)",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "nginx",
			}},
		},
		expected: false,
		version:  "",
	}}

	for _, tt := range tests {
		s := &ApacheSignature{}
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
