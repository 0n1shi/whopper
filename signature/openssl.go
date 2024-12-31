package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type OpenSSLSignature struct{}

var _ analyzer.Signature = (*OpenSSLSignature)(nil)

func (s *OpenSSLSignature) Name() string {
	return "OpenSSL"
}

func (s *OpenSSLSignature) Description() string {
	return "OpenSSL is a software library for applications that provide secure communications over computer networks."
}

func (s *OpenSSLSignature) Check(response *crawler.Response) bool {
	for _, header := range response.Headers {
		if header.Name == "server" && strings.Contains(header.Value, "OpenSSL") {
			return true
		}
	}
	return false
}

func (s *OpenSSLSignature) Version(response *crawler.Response) string {
	for _, header := range response.Headers {
		matches := regexp.MustCompile(`OpenSSL/(\d+\.\d+\.\d+)`).FindStringSubmatch(header.Value)
		if len(matches) < 2 {
			continue
		}
		return matches[1]
	}
	return ""
}

func (s *OpenSSLSignature) CPE(version string) string {
	return "cpe:/a:openssl:openssl:" + version // e.g. cpe:/a:openssl:openssl:1.1.1
}

func (s *OpenSSLSignature) Tags() []string {
	return []string{analyzer.TagWebServerExtension}
}
