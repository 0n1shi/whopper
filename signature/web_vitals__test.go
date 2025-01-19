package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestWebVitalsSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		detected bool
		version  string
	}{{
		name:     "Empty response",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "URL without web-vitals",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "nginx",
			}},
		},
		detected: false,
		version:  "",
	}, {
		name: "URL with web-vitals",
		response: &crawler.Response{
			Url: "https://unpkg.com/web-vitals@2.1.4/dist/web-vitals.iife.js",
		},
		detected: true,
		version:  "2.1.4",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected := Detect(tt.response, &WebVitalsSignature, "example.com")
			version := GetVersion(tt.response, &WebVitalsSignature)
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
