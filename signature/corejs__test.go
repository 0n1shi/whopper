package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestCoreJsSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		detected bool
		version  string
	}{{
		name: "No body and no url",
		response: &crawler.Response{
			Url:          "",
			ResourceType: crawler.ResourceTypeScript,
		},
		detected: false,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         ",license:\"https://github.com/zloirock/core-js/blob/v3.33.2/LICENSE\"",
		},
		detected: true,
		version:  "3.33.2",
	}, {
		name: "Body with no version",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         ",license:\"https://github.com/zloirock/core-js/blob/",
		},
		detected: true,
		version:  "",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected := Detect(tt.response, &CoreJsSignature, "example.com")
			version := GetVersion(tt.response, &CoreJsSignature)
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
