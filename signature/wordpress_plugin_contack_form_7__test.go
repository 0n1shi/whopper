package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestWordpressPluginContackForm7Signature(t *testing.T) {
	cases := []TestCase{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "URL",
		response: &crawler.Response{
			Url: "https://example.com/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=5.4.1",
		},
		detected: true,
		version:  "5.4.1",
	}, {
		name: "URL without version",
		response: &crawler.Response{
			Url: "https://example.com/wp-content/plugins/contact-form-7/includes/css/styles.css",
		},
		detected: true,
		version:  "",
	}}

	runTests(t, cases, &WordpressPluginContactForm7Signature)
}
