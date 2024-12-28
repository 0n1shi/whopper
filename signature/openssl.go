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

func (s *OpenSSLSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		for _, header := range response.Headers {
			if header.Name == "server" && strings.Contains(header.Value, "OpenSSL") {
				return true
			}
		}
	}
	return false
}

func (s *OpenSSLSignature) Versions(responses []*crawler.Response) []string {
	versions := []string{}
	for _, response := range responses {
		for _, header := range response.Headers {
			if !(header.Name == "server" && strings.Contains(header.Value, "OpenSSL/")) {
				continue
			}
			matches := regexp.MustCompile(`OpenSSL/(\d+\.\d+\.\d+)`).FindStringSubmatch(header.Value)
			if len(matches) < 2 {
				continue
			}
			versions = append(versions, matches[1])
		}
	}
	return unique(versions)
}

func (s *OpenSSLSignature) Tags() []string {
	return []string{analyzer.TagWebServerExtension}
}
