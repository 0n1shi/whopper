package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestBackboneJsSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		expected bool
		version  string
	}{{
		name: "No body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
		},
		expected: false,
		version:  "",
	}, {
		name: "Error message",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         "throw new Error(\"Backbone.history has already been started\");",
		},
		expected: true,
		version:  "",
	}, {
		name: "Error message and has version",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         "throw new Error(\"Backbone.history has already been started\");t.VERSION=\"1.4.1\"",
		},
		expected: true,
		version:  "1.4.1",
	}}

	for _, tt := range tests {
		s := &BackboneJsSignature{}
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
