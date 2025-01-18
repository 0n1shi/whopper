package signature

import (
	"testing"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

func TestAwsAlbSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		detected bool
		version  string
	}{{
		name:     "No cookies",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "AWSALB cookie",
		response: &crawler.Response{
			Url: "http://example.com",
			Cookies: []*crawler.Cookie{{
				Name:  "AWSALB",
				Value: "XyFb7cYWVbd39UCO3CbDi",
			}},
		},
		detected: true,
		version:  "",
	}, {
		name: "AWSALB HTTP header",
		response: &crawler.Response{
			Url: "http://example.com",
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "awselb/2.0",
			}},
		},
		detected: true,
		version:  "2.0",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected, version := analyzer.Analyze(tt.response, &AwsAlbSignature, "example.com")
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
