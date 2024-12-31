package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestJQuerySignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		expected bool
		version  string
	}{{
		name:     "No body and no url",
		response: &crawler.Response{},
		expected: false,
		version:  "",
	}, {
		name: "URL",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery",
		},
		expected: true,
		version:  "3.6.0",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         "/*! jQuery v3.6.0 | (c) OpenJS Foundation and other contributors | jquery.org/license */",
		},
		expected: true,
		version:  "3.6.0",
	}}

	for _, tt := range tests {
		s := &JquerySignature{}
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
