package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestApacheSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No headers",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "Server header",
		response: &crawler.Response{
			Url: SameHostUrl,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache",
			}},
		},
		detected: true,
		version:  "",
	}, {
		name: "Server header with version",
		response: &crawler.Response{
			Url: SameHostUrl,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.4.29 (Ubuntu)",
			}},
		},
		detected: true,
		version:  "2.4.29",
	}, {
		name: "Server header with version and other info",
		response: &crawler.Response{
			Url: SameHostUrl,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.4.29 (Ubuntu) PHP/7.2.24-0ubuntu0.18.04.7",
			}},
		},
		detected: true,
		version:  "2.4.29",
	}, {
		name: "Server header with version and other info (different order)",
		response: &crawler.Response{
			Url: SameHostUrl,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "PHP/7.2.24-0ubuntu0.18.04.7 Apache/2.4.29 (Ubuntu)",
			}},
		},
		detected: true,
		version:  "2.4.29",
	}, {
		name: "Server header with version but other host",
		response: &crawler.Response{
			Url: OtherHostUrl,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.4.29 (Ubuntu)",
			}},
		},
		detected: false,
		version:  "",
	}, {
		name: "Server header (Nginx)",
		response: &crawler.Response{
			Url: SameHostUrl,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "nginx",
			}},
		},
		detected: false,
		version:  "",
	}}

	runTests(t, cases, &ApacheSignature)
}
