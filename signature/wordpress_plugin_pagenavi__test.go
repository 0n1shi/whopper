package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestWordpressPluginPageNaviSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		detected bool
		version  string
	}{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Body:         "Default style for WP-PageNavi plugin",
		},
		detected: true,
		version:  "",
	}, {
		name: "URL",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Url:          "https://gmo-cybersecurity.com/wp-content/plugins/wp-pagenavi/pagenavi-css.css?ver=2.70",
		},
		detected: true,
		version:  "2.70",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected := Detect(tt.response, &WordpressPluginPageNaviSignature, "example.com")
			version := GetVersion(tt.response, &WordpressPluginPageNaviSignature)
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
