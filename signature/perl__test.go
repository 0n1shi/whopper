package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestPerlSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "Server header",
		response: &crawler.Response{
			Url: SameHostUrl,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.4.25 (Unix) OpenSSL/1.0.2j PHP/7.1.1 mod_perl/2.0.8-dev Perl/v5.16.3",
			}},
		},
		detected: true,
		version:  "5.16.3",
	}, {
		name: "Server header 2",
		response: &crawler.Response{
			Url: SameHostUrl,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.2.14 (Unix) mod_ssl/2.2.14 OpenSSL/1.0.0o mod_perl/2.0.4 Perl/v5.10.0",
			}},
		},
		detected: true,
		version:  "5.10.0",
	}, {
		name: "Server header 3",
		response: &crawler.Response{
			Url: SameHostUrl,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Mojolicious (Perl)",
			}},
		},
		detected: true,
		version:  "",
	}}

	runTests(t, cases, &PerlSignature)
}
