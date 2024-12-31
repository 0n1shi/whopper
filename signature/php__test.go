package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestPhpSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		expected bool
		version  string
	}{{
		name: "No body and no url",
		response: &crawler.Response{
			Url: "",
			ResourceType: crawler.ResourceTypeScript,
		},
		expected: false,
		version:  "",
	}, {
		name: "Server header",
		response: &crawler.Response{
			Headers: []*crawler.Header{
				{
					Name:  "server",
					Value: "Apache/2.4.6 (CentOS) OpenSSL/1.0.2k-fips PHP/5.4.16",
				},
			},
		},
		expected: true,
		version:  "5.4.16",
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
		version:  "5.6.33",
	}, {
		name: "X-Powered-By header",
		response: &crawler.Response{
			Headers: []*crawler.Header{
				{
					Name:  "x-powered-by",
					Value: "X-Powered-By: PHP/5.3.6-13ubuntu3.6",
				},
			},
		},
		expected: true,
		version:  "5.3.6",
	}, {
		name: "X-Powered-By header 2",
		response: &crawler.Response{
			Headers: []*crawler.Header{
				{
					Name:  "x-powered-by",
					Value: "PHP/5.2.10",
				},
			},
		},
		expected: true,
		version:  "5.2.10",
	}}

	for _, tt := range tests {
		s := &PhpSignature{}
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
