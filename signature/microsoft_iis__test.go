package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestMicrosoftIisSignature(t *testing.T) {
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
				Value: "Microsoft-IIS",
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
				Value: "Microsoft-IIS/10.0",
			}},
		},
		detected: true,
		version:  "10.0",
	}}

	runTests(t, cases, &MicrosoftIisSignature)
}
