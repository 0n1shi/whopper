package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestLodashSignatureCheck(t *testing.T) {
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
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "http://x.x.x.x/bower_components/lodash/lodash.js?r=0.14.9",
		},
		expected: true,
		version:  "",
	}, {
		name: "Body 2",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body: `* lodash <https://lodash.com/>
			var VERSION = '4.16.6'`,
		},
		expected: true,
		version:  "4.16.6",
	}}

	for _, tt := range tests {
		s := &LodashSignature{}
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
