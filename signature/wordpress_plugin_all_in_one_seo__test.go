package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestWordpressPluginAllInOneSEOSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "Body without version",
		response: &crawler.Response{
			Body: `<!-- All in One SEO - aioseo.com -->`,
		},
		detected: true,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			Body: `<!-- All in One SEO 4.7.8 - aioseo.com -->`,
		},
		detected: true,
		version:  "4.7.8",
	}, {
		name: "Body 2",
		response: &crawler.Response{
			Body: `<meta name="generator" content="All in One SEO (AIOSEO) 4.7.8" />`,
		},
		detected: true,
		version:  "4.7.8",
	}}

	runTests(t, cases, &WordpressPluginAllInOneSEOSignature)
}
