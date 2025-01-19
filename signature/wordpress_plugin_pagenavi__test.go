package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestWordpressPluginPageNaviSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Body:         "Default style for WP-PageNavi plugin",
		},
		detected: true,
		version:  "",
	}, {
		name: "URL",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Url:          "https://gmo-cybersecurity.com/wp-content/plugins/wp-pagenavi/pagenavi-css.css?ver=2.70",
		},
		detected: true,
		version:  "2.70",
	}}

	runTests(t, cases, &WordpressPluginPageNaviSignature)
}
