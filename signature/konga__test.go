package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestKongaSignatureCheck(t *testing.T) {
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
			Url: "http://x.x.x.x/js/app/core/directives/konga-loader.js?r=0.14.9",
		},
		expected: true,
		version:  "0.14.9",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeDocument,
			Body:         `<script>
  window.enableLogs = true;
  window.konga_version = "0.14.9";
  window.no_auth = false;
  window.initAngular = true;
</script>`,
		},
		expected: true,
		version:  "0.14.9",
	}}

	for _, tt := range tests {
		s := &KongaSignature{}
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
