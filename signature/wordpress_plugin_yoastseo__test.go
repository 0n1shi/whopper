package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestWordpressPluginYoastSEOSignature(t *testing.T) {
	cases := []TestCase{{
		name: "No body and no url",
		response: &crawler.Response{
			Url: "",
		},
		detected: false,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeDocument,
			Body:         "<!-- This site is optimized with the Yoast SEO plugin v22.9 - https://yoast.com/wordpress/plugins/seo/ -->",
		},
		detected: true,
		version:  "22.9",
	}, {
		name: "Body 2",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeDocument,
			Body:         "<!-- This site is optimized with the Yoast SEO plugin - https://yoast.com/wordpress/plugins/seo/ -->",
		},
		detected: true,
		version:  "",
	}}

	runTests(t, cases, &WordpressPluginYoastSEOSignature)
}
