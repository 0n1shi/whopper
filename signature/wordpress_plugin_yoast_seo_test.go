package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestWordpressPluginYoastSEOSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		expected bool
		version  string
	}{{
		name: "No body and no url",
		response: &crawler.Response{
			Url: "",
		},
		expected: false,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeDocument,
			Body: "<!-- This site is optimized with the Yoast SEO plugin v22.9 - https://yoast.com/wordpress/plugins/seo/ -->",
		},
		expected: true,
		version:  "22.9",
	}, {
		name: "Body 2",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeDocument,
			Body: "<!-- This site is optimized with the Yoast SEO plugin - https://yoast.com/wordpress/plugins/seo/ -->",
		},
		expected: true,
		version:  "",
	}}

	for _, tt := range tests {
		s := &WordpressPluginYoastSEOSignature{}
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
