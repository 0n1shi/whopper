package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestJQueryUISignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		expected bool
		version  string
	}{{
		name:     "No body and no url",
		response: &crawler.Response{},
		expected: false,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Body:         " * jQuery UI CSS Framework 1.13.2",
		},
		expected: true,
		version:  "1.13.2",
	}, {
		name: "Body 2",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Body:         " * jQuery UI CSS Framework",
		},
		expected: true,
		version:  "",
	}}

	for _, tt := range tests {
		s := &JqueryUiSignature{}
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
