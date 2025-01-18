package signature

import (
	"testing"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

func TestApacheSignatureCheck(t *testing.T) {
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
				Value: "Apache",
			}},
		},
		detected: true,
		version:  "",
	}, {
		name: "Server header with version",
		response: &crawler.Response{
			Url: "http://example.com",
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.4.29 (Ubuntu)",
			}},
		},
		detected: true,
		version:  "2.4.29",
	}, {
		name: "Server header with version and other info",
		response: &crawler.Response{
			Url: "http://example.com",
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.4.29 (Ubuntu) PHP/7.2.24-0ubuntu0.18.04.7",
			}},
		},
		detected: true,
		version:  "2.4.29",
	}, {
		name: "Server header with version and other info (different order)",
		response: &crawler.Response{
			Url: "http://example.com",
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "PHP/7.2.24-0ubuntu0.18.04.7 Apache/2.4.29 (Ubuntu)",
			}},
		},
		detected: true,
		version:  "2.4.29",
	}, {
		name: "Server header with version but other host",
		response: &crawler.Response{
			Url: "http://other.com",
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.4.29 (Ubuntu)",
			}},
		},
		detected: false,
		version:  "",
	}, {
		name: "Server header (Nginx)",
		response: &crawler.Response{
			Url: "http://example.com",
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "nginx",
			}},
		},
		detected: false,
		version:  "",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected, version := analyzer.Analyze(tt.response, &ApacheSignature, "example.com")
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %q, want %q", version, tt.version)
			}
		})
	}
}
