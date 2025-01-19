package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestLodashSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "http://x.x.x.x/bower_components/lodash/lodash.js?r=0.14.9",
		},
		detected: true,
		version:  "",
	}, {
		name: "Body 2",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body: `* lodash <https://lodash.com/>
			var VERSION = '4.16.6'`,
		},
		detected: true,
		version:  "4.16.6",
	}}

	runTests(t, cases, &LodashSignature)
}
