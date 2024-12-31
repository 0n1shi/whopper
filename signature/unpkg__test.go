package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestUnpkgSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		expected bool
		version  string
	}{{
		name:     "No headers",
		response: &crawler.Response{},
		expected: false,
		version:  "",
	}, {
		name: "URL contains unpkg.com",
		response: &crawler.Response{
			Url: "https://unpkg.com/web-vitals@2.1.4/dist/web-vitals.iife.js",
		},
		expected: true,
		version:  "",
	}}

	for _, tt := range tests {
		s := &UnpkgSignature{}
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
