package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestSwiperSignatureCheck(t *testing.T) {
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
			Url: "https://cdn.jsdelivr.net/npm/swiper@8.4.7/swiper-bundle.min.js?ver=0.1.12",
		},
		detected: true,
		version:  "8.4.7",
	}, {
		name: "Body 2",
		response: &crawler.Response{
			Body: "* Swiper 8.4.7",
		},
		detected: true,
		version:  "8.4.7",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected := Detect(tt.response, &SwiperSignature, "example.com")
			version := GetVersion(tt.response, &SwiperSignature)
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
