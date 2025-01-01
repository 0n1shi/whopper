package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestPerlSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		expected bool
		version  string
	}{{
		name:     "No body and no url",
		response: &crawler.Response{},
		expected: false,
		version:  "",
	}, {
		name: "Server header",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.4.25 (Unix) OpenSSL/1.0.2j PHP/7.1.1 mod_perl/2.0.8-dev Perl/v5.16.3",
			}},
		},
		expected: true,
		version:  "5.16.3",
	}, {
		name: "Server header 2",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Apache/2.2.14 (Unix) mod_ssl/2.2.14 OpenSSL/1.0.0o mod_perl/2.0.4 Perl/v5.10.0",
			}},
		},
		expected: true,
		version:  "5.10.0",
	}, {
		name: "Server header 3",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "server",
				Value: "Mojolicious (Perl)",
			}},
		},
		expected: true,
		version:  "",
	}}

	for _, tt := range tests {
		s := &PerlSignature{}
		t.Run(tt.name, func(t *testing.T) {
			if got := s.Check(tt.response); got != tt.expected {
				t.Errorf("Check() = %v, want %v", got, tt.expected)
			}
			if got := s.Version(tt.response); got != tt.version {
				t.Errorf("Version() = %v, want %v", got, tt.version)
			}
		})
	}
}
