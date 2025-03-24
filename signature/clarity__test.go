package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestClaritySignature(t *testing.T) {
	cases := []TestCase{{
		name: "No body and no url",
		response: &crawler.Response{
			URL:          "",
			ResourceType: crawler.ResourceTypeScript,
		},
		detected: false,
		version:  "",
	}, {
		name: "Url",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			URL:          "https://www.clarity.ms/s/0.7.59/clarity.js",
		},
		detected: true,
		version:  "0.7.59",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			URL:          "https://www.clarity.ms/s/x.x.x/clarity.js",
			Body:         "/* clarity-js v0.7.59: https://...",
		},
		detected: true,
		version:  "0.7.59",
	}}

	runTests(t, cases, &ClaritySignature)
}
