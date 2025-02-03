package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestVueJsSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No headers",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "Vue.js in body",
		response: &crawler.Response{
			Body: "Vue.js",
		},
		detected: true,
		version:  "",
	}, {
		name: "Vue.js in body with version",
		response: &crawler.Response{
			Body: "Vue.js v2.6.14",
		},
		detected: true,
		version:  "2.6.14",
	}, {
		name: "Vue.js in body (minified) with version",
		response: &crawler.Response{
			Url:  "/vue.js",
			Body: "bn.version=\"2.6.14\"",
		},
		detected: true,
		version:  "2.6.14",
	}}

	runTests(t, cases, &VueJsSignature)
}
