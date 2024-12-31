package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestWebVitalsSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		expected bool
		version  string
	}{{
		name:     "Empty response",
		response: &crawler.Response{},
		expected: false,
		version:  "",
	}, {
		name: "URL without web-vitals",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "nginx",
			}},
		},
		expected: false,
		version:  "",
	}, {
		name: "URL with web-vitals",
		response: &crawler.Response{
			Url: "https://unpkg.com/web-vitals@2.1.4/dist/web-vitals.iife.js",
		},
		expected: true,
		version:  "2.1.4",
	}}

	for _, tt := range tests {
		s := &WebVitalsSignature{}
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
