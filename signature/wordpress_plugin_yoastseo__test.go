package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestWordpressPluginYoastSEOSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		detected bool
		version  string
	}{{
		name: "No body and no url",
		response: &crawler.Response{
			Url: "",
		},
		detected: false,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeDocument,
			Body:         "<!-- This site is optimized with the Yoast SEO plugin v22.9 - https://yoast.com/wordpress/plugins/seo/ -->",
		},
		detected: true,
		version:  "22.9",
	}, {
		name: "Body 2",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeDocument,
			Body:         "<!-- This site is optimized with the Yoast SEO plugin - https://yoast.com/wordpress/plugins/seo/ -->",
		},
		detected: true,
		version:  "",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected := Detect(tt.response, &WordpressPluginYoastSEOSignature, "example.com")
			version := GetVersion(tt.response, &WordpressPluginYoastSEOSignature)
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
