package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestClaritySignatureCheck(t *testing.T) {
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
		name: "Url",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "https://www.clarity.ms/s/0.7.59/clarity.js",
		},
		detected: true,
		version:  "0.7.59",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "https://www.clarity.ms/s/x.x.x/clarity.js",
			Body:         "/* clarity-js v0.7.59: https://...",
		},
		detected: true,
		version:  "0.7.59",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected := Detect(tt.response, &ClaritySignature, "example.com")
			version := GetVersion(tt.response, &ClaritySignature)
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
