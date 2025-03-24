package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestCoreJsSignature(t *testing.T) {
	cases := []TestCase{{
		name: "No body and no url",
		response: &crawler.Response{
			URL:          "",
			ResourceType: crawler.ResourceTypeScript,
		},
		detected: false,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         ",license:\"https://github.com/zloirock/core-js/blob/v3.33.2/LICENSE\"",
		},
		detected: true,
		version:  "3.33.2",
	}, {
		name: "Body with no version",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         ",license:\"https://github.com/zloirock/core-js/blob/",
		},
		detected: true,
		version:  "",
	}}

	runTests(t, cases, &CoreJsSignature)
}
