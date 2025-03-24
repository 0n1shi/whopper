package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestPhpSignature(t *testing.T) {
	cases := []TestCase{{
		name: "No body and no url",
		response: &crawler.Response{
			URL:          "",
			ResourceType: crawler.ResourceTypeScript,
		},
		detected: false,
		version:  "",
	}, {
		name: "Server header",
		response: &crawler.Response{
			BrowserURL: SameHostURL,
			URL:        SameHostURL,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.4.6 (CentOS) OpenSSL/1.0.2k-fips PHP/5.4.16",
			}},
		},
		detected: true,
		version:  "5.4.16",
	}, {
		name: "Server header 2",
		response: &crawler.Response{
			BrowserURL: SameHostURL,
			URL:        SameHostURL,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.4.29 (Unix) OpenSSL/1.0.2n PHP/5.6.33 mod_perl/2.0.8-dev Perl/v5.16.3",
			}},
		},
		detected: true,
		version:  "5.6.33",
	}, {
		name: "X-Powered-By header",
		response: &crawler.Response{
			BrowserURL: SameHostURL,
			URL:        SameHostURL,
			Headers: []*crawler.Header{{
				Name:  "x-powered-by",
				Value: "PHP/5.3.6-13ubuntu3.6",
			}},
		},
		detected: true,
		version:  "5.3.6",
	}, {
		name: "X-Powered-By header 2",
		response: &crawler.Response{
			BrowserURL: SameHostURL,
			URL:        SameHostURL,
			Headers: []*crawler.Header{{
				Name:  "x-powered-by",
				Value: "PHP/5.2.10",
			}},
		},
		detected: true,
		version:  "5.2.10",
	}}

	runTests(t, cases, &PhpSignature)
}
