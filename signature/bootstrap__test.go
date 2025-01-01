package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestBootstrapSignatureCheck(t *testing.T) {
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
		name: "URL with version",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Url:          "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
		},
		expected: true,
		version:  "3.3.7",
	}, {
		name: "Body with version",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Body:         "* Bootstrap v4.6.0",
		},
		expected: true,
		version:  "4.6.0",
	}}

	for _, tt := range tests {
		s := &BootstrapSignature{}
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
