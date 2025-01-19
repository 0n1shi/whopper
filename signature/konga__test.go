package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestKongaSignature(t *testing.T) {
	cases := []TestCase{{
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

	runTests(t, cases, &KongaSignature)
}
