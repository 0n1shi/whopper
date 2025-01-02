package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestAngularJSSignatureCheck(t *testing.T) {
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
		name: "URL",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "http://x.x.x.x/bower_components/angular-sanitize/angular-sanitize.js?r=0.14.9",
		},
		expected: true,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "http://x.x.x.x/bower_components/angular-sanitize/angular-sanitize.js?r=0.14.9",
			Body:         " * @license AngularJS v1.5.11",
		},
		expected: true,
		version:  "1.5.11",
	}}

	for _, tt := range tests {
		s := &AngularJsSignature{}
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
