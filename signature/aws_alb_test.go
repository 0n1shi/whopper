package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestAwsAlbSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		expected bool
		version  string
	}{{
		name: "No cookies",
		response: &crawler.Response{
			Cookies: []*crawler.Cookie{},
		},
		expected: false,
		version:  "",
	}, {
		name: "AWSALB cookie",
		response: &crawler.Response{
			Cookies: []*crawler.Cookie{{
				Name:  "AWSALB",
				Value: "XyFb7cYWVbd39UCO3CbDi",
			}},
		},
		expected: true,
		version:  "",
	}}

	for _, tt := range tests {
		s := &AwsAlbSignature{}
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
