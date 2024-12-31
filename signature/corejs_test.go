package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestCoreJsSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		expected bool
		version  string
	}{{
		name: "No body and no url",
		response: &crawler.Response{
			Url:          "",
			ResourceType: crawler.ResourceTypeScript,
		},
		expected: false,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         ",license:\"https://github.com/zloirock/core-js/blob/v3.33.2/LICENSE\"",
		},
		expected: true,
		version:  "3.33.2",
	}, {
		name: "Body with no version",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         ",license:\"https://github.com/zloirock/core-js/blob/",
		},
		expected: true,
		version:  "",
	}}

	for _, tt := range tests {
		s := &CorejsSignature{}
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
