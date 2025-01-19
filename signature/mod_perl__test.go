package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestModPerlSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "Server header",
		response: &crawler.Response{
			Url: SameHostUrl,
			Headers: []*crawler.Header{
				{
					Name:  "server",
					Value: "Apache/2.4.37 (AlmaLinux) OpenSSL/1.1.1k",
				},
			},
		},
		detected: false,
		version:  "",
	}, {
		name: "Server header 2",
		response: &crawler.Response{
			Url: SameHostUrl,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.4.29 (Unix) OpenSSL/1.0.2n PHP/5.6.33 mod_perl/2.0.8-dev Perl/v5.16.3",
			}},
		},
		detected: true,
		version:  "2.0.8",
	}, {
		name: "Server header 3",
		response: &crawler.Response{
			Url: SameHostUrl,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.4.6 (CentOS) OpenSSL/1.0.2k-fips PHP/5.6.40",
			}},
		},
		detected: false,
		version:  "",
	}, {
		name: "Server header 4",
		response: &crawler.Response{
			Url: SameHostUrl,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.4.6 (CentOS) OpenSSL/1.0.2k-fips PHP/5.4.16 mod_perl/2.0.11 Perl/v5.16.3",
			}},
		},
		detected: true,
		version:  "2.0.11",
	}, {
		name: "Server header 5 but other host",
		response: &crawler.Response{
			Url: OtherHostUrl,
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.4.6 (CentOS) OpenSSL/1.0.2k-fips PHP/5.4.16 mod_perl/2.0.11 Perl/v5.16.3",
			}},
		},
		detected: false,
		version:  "",
	}}

	runTests(t, cases, &ModPerlSignature)
}
