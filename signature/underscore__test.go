package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestUnderscoreSignatureCheck(t *testing.T) {
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
		name: "URL",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "https://example.com/js/underscore-min.js",
		},
		expected: true,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         "Underscore.js 1.8.3",
		},
		expected: true,
		version:  "1.8.3",
	}}

	for _, tt := range tests {
		s := &UnderscoreSignature{}
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
