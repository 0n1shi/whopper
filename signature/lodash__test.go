package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestLodashSignatureCheck(t *testing.T) {
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
			ResourceType: crawler.ResourceTypeScript,
			Url:          "http://x.x.x.x/bower_components/lodash/lodash.js?r=0.14.9",
		},
		detected: true,
		version:  "",
	}, {
		name: "Body 2",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body: `* lodash <https://lodash.com/>
			var VERSION = '4.16.6'`,
		},
		detected: true,
		version:  "4.16.6",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected := Detect(tt.response, &LodashSignature, "example.com")
			version := GetVersion(tt.response, &LodashSignature)
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
