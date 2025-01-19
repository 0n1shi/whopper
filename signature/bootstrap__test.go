package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestBootstrapSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		detected bool
		version  string
	}{{
		name:     "No headers",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "URL with version",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Url:          "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
		},
		detected: true,
		version:  "3.3.7",
	}, {
		name: "Body with version",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Body:         "* Bootstrap v4.6.0",
		},
		detected: true,
		version:  "4.6.0",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected := Detect(tt.response, &BootstrapSignature, "example.com")
			version := GetVersion(tt.response, &BootstrapSignature)
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
