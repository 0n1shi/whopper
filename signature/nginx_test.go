package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestNginxSignatureCheck(t *testing.T) {
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
				Value: "nginx",
			}},
		},
		expected: true,
		version:  "",
	}, {
		name: "Server header with version",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "nginx/1.18.0 (Ubuntu)",
			}},
		},
		expected: true,
		version:  "1.18.0",
	}, {
		name: "Server header with version and other info",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "nginx/1.20.1",
			}},
		},
		expected: true,
		version:  "1.20.1",
	}}

	for _, tt := range tests {
		s := &NginxSignature{}
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
