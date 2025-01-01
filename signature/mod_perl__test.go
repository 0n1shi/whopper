package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestModPerlSignatureCheck(t *testing.T) {
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
			Headers: []*crawler.Header{
				{
					Name:  "server",
					Value: "Apache/2.4.37 (AlmaLinux) OpenSSL/1.1.1k",
				},
			},
		},
		expected: false,
		version:  "",
	}, {
		name: "Server header 2",
		response: &crawler.Response{
			Headers: []*crawler.Header{
				{
					Name:  "server",
					Value: "Apache/2.4.29 (Unix) OpenSSL/1.0.2n PHP/5.6.33 mod_perl/2.0.8-dev Perl/v5.16.3",
				},
			},
		},
		expected: true,
		version:  "2.0.8",
	}, {
		name: "Server header 3",
		response: &crawler.Response{
			Headers: []*crawler.Header{
				{
					Name:  "server",
					Value: "Apache/2.4.6 (CentOS) OpenSSL/1.0.2k-fips PHP/5.6.40",
				},
			},
		},
		expected: false,
		version:  "",
	}, {
		name: "Server header 4",
		response: &crawler.Response{
			Headers: []*crawler.Header{
				{
					Name:  "server",
					Value: "Apache/2.4.6 (CentOS) OpenSSL/1.0.2k-fips PHP/5.4.16 mod_perl/2.0.11 Perl/v5.16.3",
				},
			},
		},
		expected: true,
		version:  "2.0.11",
	}}

	for _, tt := range tests {
		s := &ModPerlSignature{}
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
