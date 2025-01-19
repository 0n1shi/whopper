package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestJQuerySignatureCheck(t *testing.T) {
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
		name: "URL",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery",
		},
		detected: true,
		version:  "3.6.0",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         "/*! jQuery v3.6.0 | (c) OpenJS Foundation and other contributors | jquery.org/license */",
		},
		detected: true,
		version:  "3.6.0",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected := Detect(tt.response, &JQuerySignature, "example.com")
			version := GetVersion(tt.response, &JQuerySignature)
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
