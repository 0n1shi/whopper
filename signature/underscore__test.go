package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestUnderscoreSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No headers",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "URL",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			URL:          "https://example.com/js/underscore-min.js",
		},
		detected: true,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         "Underscore.js 1.8.3",
		},
		detected: true,
		version:  "1.8.3",
	}}

	runTests(t, cases, &UnderscoreSignature)
}
