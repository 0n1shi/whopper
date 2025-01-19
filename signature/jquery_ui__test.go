package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestJQueryUISignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		detected bool
		version  string
	}{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected : false,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Body:         " * jQuery UI CSS Framework 1.13.2",
		},
		detected : true,
		version:  "1.13.2",
	}, {
		name: "Body 2",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Body:         " * jQuery UI CSS Framework",
		},
		detected : true,
		version:  "",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected := Detect(tt.response, &JQueryUISignature, "example.com")
			version := GetVersion(tt.response, &JQueryUISignature)
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
