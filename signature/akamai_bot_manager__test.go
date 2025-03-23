package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestAkamaiBotManagerSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No headers",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "Server header",
		response: &crawler.Response{
			Url: SameHostUrl,
			Cookies: []*crawler.Cookie{{
				Name: "bm_sz",
				Value: "8225227D25A3082E4A6B1C8BA0A500CD",
			}},
		},
		detected: true,
	}}

	runTests(t, cases, &AkamaiBotManagerSignature)
}
