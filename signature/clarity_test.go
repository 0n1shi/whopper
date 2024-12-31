package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestClaritySignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		expected bool
		version  string
	}{{
		name: "No body and no url",
		response: &crawler.Response{
			Url: "",
			ResourceType: crawler.ResourceTypeScript,
		},
		expected: false,
		version:  "",
	}, {
		name: "Url",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "https://www.clarity.ms/s/0.7.59/clarity.js",
		},
		expected: true,
		version:  "0.7.59",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "https://www.clarity.ms/s/x.x.x/clarity.js",
			Body:         "/* clarity-js v0.7.59: https://...",
		},
		expected: true,
		version:  "0.7.59",
	}}

	for _, tt := range tests {
		s := &ClaritySignature{}
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
