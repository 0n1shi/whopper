package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestSwiperSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		expected bool
		version  string
	}{{
		name: "No body and no url",
		response: &crawler.Response{
			Url: "",
		},
		expected: false,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			Url: "https://cdn.jsdelivr.net/npm/swiper@8.4.7/swiper-bundle.min.js?ver=0.1.12",
		},
		expected: true,
		version:  "8.4.7",
	}, {
		name: "Body 2",
		response: &crawler.Response{
			Body: "* Swiper 8.4.7",
		},
		expected: true,
		version:  "8.4.7",
	}}

	for _, tt := range tests {
		s := &SwiperSignature{}
		t.Run(tt.name, func(t *testing.T) {
			if got := s.Check(tt.response); got != tt.expected {
				t.Errorf("Check() = %v, want %v", got, tt.expected)
			}
			if got := s.Version(tt.response); got != tt.version {
				t.Errorf("Version() = %v, want %v", got, tt.version)
			}
		})
	}
}
