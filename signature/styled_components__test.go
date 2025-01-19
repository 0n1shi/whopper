package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestStyledComponentsSignatureCheck(t *testing.T) {
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
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         "R=\"style[\"+w+'][data-styled-version=\"5.3.11\"]'",
		},
		detected: true,
		version:  "5.3.11",
	}, {
		name: "Body 2",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         ",r.setAttribute(\"data-styled-version\",\"5.3.11\");",
		},
		detected: true,
		version:  "5.3.11",
	}, {
		name: "Body 3",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         "\"+[n&&'nonce=\"'+n+'\"',w+'=\"true\"','data-styled-version=\"5.3.11\"']",
		},
		detected: true,
		version:  "5.3.11",
	}, {
		name: "Body 4",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         "var n=((t={})[w]=\"\",t[\"data-styled-version\"]=\"5.3.11\",",
		},
		detected: true,
		version:  "5.3.11",
	}, {
		name: "Body 5",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeDocument,
			Body:         "<style data-styled=\"true\" data-styled-version=\"5.3.11\">",
		},
		detected: true,
		version:  "5.3.11",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected := Detect(tt.response, &StyledComponentsSignature, "example.com")
			version := GetVersion(tt.response, &StyledComponentsSignature)
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
