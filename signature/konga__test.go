package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestKongaSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		detected bool
		version  string
	}{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "URL",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "http://x.x.x.x/js/app/core/directives/konga-loader.js?r=0.14.9",
		},
		detected: true,
		version:  "0.14.9",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeDocument,
			Body: `<script>
  window.enableLogs = true;
  window.konga_version = "0.14.9";
  window.no_auth = false;
  window.initAngular = true;
</script>`,
		},
		detected: true,
		version:  "0.14.9",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected := Detect(tt.response, &KongaSignature, "example.com")
			version := GetVersion(tt.response, &KongaSignature)
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
