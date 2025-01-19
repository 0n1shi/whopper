package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestNginxSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		detected bool
		version  string
	}{{
		name: "No headers",
		response: &crawler.Response{
			Headers: []*crawler.Header{},
		},
		detected: false,
		version:  "",
	}, {
		name: "Server header",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "nginx",
			}},
		},
		detected: true,
		version:  "",
	}, {
		name: "Server header with version",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "nginx/1.18.0 (Ubuntu)",
			}},
		},
		detected: true,
		version:  "1.18.0",
	}, {
		name: "Server header with version and other info",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "nginx/1.20.1",
			}},
		},
		detected: true,
		version:  "1.20.1",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected := Detect(tt.response, &NginxSignature, "example.com")
			version := GetVersion(tt.response, &NginxSignature)
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
