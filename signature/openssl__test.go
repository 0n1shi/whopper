package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestOpenSSLSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		detected bool
		version  string
	}{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
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
		detected: true,
		version:  "1.1.1k",
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
		detected: true,
		version:  "1.0.2n",
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
		detected: true,
		version:  "1.0.2k",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected := Detect(tt.response, &OpenSSLSignature, "example.com")
			version := GetVersion(tt.response, &OpenSSLSignature)
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
