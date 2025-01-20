package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestWordpressSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "URL",
		response: &crawler.Response{
			Url: SameHostUrl,
			Body: `<meta name="generator" content="WordPress" />`,
		},
		detected: true,
		version:  "",
	}, {
		name: "URL 2",
		response: &crawler.Response{
			Url: SameHostUrl,
			Body: `<meta name="generator" content="WordPress 6.7.1" />`,
		},
		detected: true,
		version:  "6.7.1",
	}}

	runTests(t, cases, &WordpressSignature)
}
