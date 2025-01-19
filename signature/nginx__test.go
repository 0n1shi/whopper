package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestNginxSignature(t *testing.T) {
	cases := []TestCase{{
		name: "No headers",
		response: &crawler.Response{
			Headers: []*crawler.Header{},
		},
		detected: false,
		version:  "",
	}, {
		name: "Server header",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "nginx",
			}},
		},
		detected: true,
		version:  "",
	}, {
		name: "Server header with version",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "nginx/1.18.0 (Ubuntu)",
			}},
		},
		detected: true,
		version:  "1.18.0",
	}, {
		name: "Server header with version and other info",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "nginx/1.20.1",
			}},
		},
		detected: true,
		version:  "1.20.1",
	}}

	runTests(t, cases, &NginxSignature)
}
