package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestUnpkgSignatureCheck(t *testing.T) {
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
		name: "URL contains unpkg.com",
		response: &crawler.Response{
			Url: "https://unpkg.com/web-vitals@2.1.4/dist/web-vitals.iife.js",
		},
		detected: true,
		version:  "",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected := Detect(tt.response, &UnpkgSignature, "example.com")
			version := GetVersion(tt.response, &UnpkgSignature)
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
