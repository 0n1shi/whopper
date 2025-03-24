package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestAspDotNetSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No headers",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "Server header",
		response: &crawler.Response{
			BrowserURL: SameHostURL,
			URL:        SameHostURL,
			Headers: []*crawler.Header{{
				Name:  "x-powered-by",
				Value: "ASP.NET",
			}},
		},
		detected: true,
		version:  "",
	}, {
		name: "Set-cookie header",
		response: &crawler.Response{
			BrowserURL: SameHostURL,
			URL:        SameHostURL,
			Headers: []*crawler.Header{{
				Name:  "set-cookie",
				Value: "ASP.NET_SessionId=abc123; path=/",
			}},
		},
		detected: true,
		version:  "",
	}, {
		name: "Cookie header",
		response: &crawler.Response{
			BrowserURL: SameHostURL,
			URL:        SameHostURL,
			Cookies: []*crawler.Cookie{{
				Name:  "ASP.NET_SessionId",
				Value: "abc123",
			}},
		},
		detected: true,
		version:  "",
	}, {
		name: "X-aspnet-version header",
		response: &crawler.Response{
			BrowserURL: SameHostURL,
			URL:        SameHostURL,
			Headers: []*crawler.Header{{
				Name:  "x-aspnet-version",
				Value: "4.0.30319",
			}},
		},
		detected: true,
		version:  "4.0.30319",
	}}

	runTests(t, cases, &AspDotNetSignature)
}
