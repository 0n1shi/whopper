package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestWebVitalsSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "Empty response",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "URL without web-vitals",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "nginx",
			}},
		},
		detected: false,
		version:  "",
	}, {
		name: "URL with web-vitals",
		response: &crawler.Response{
			URL: "https://unpkg.com/web-vitals@2.1.4/dist/web-vitals.iife.js",
		},
		detected: true,
		version:  "2.1.4",
	}}

	runTests(t, cases, &WebVitalsSignature)
}

