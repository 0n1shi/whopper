package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type ApacheSignature struct{}

var _ analyzer.Signature = (*ApacheSignature)(nil)

func (n *ApacheSignature) Name() string {
	return "Apache"
}

func (n *ApacheSignature) Description() string {
	return "A free and open-source cross-platform web server, released under the terms of Apache License 2.0."
}

func (s *ApacheSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		for _, header := range response.Headers {
			if header.Name == "server" && strings.Contains(header.Value, "Apache") {
				return true
			}
		}
	}
	return false
}

func (s *ApacheSignature) Versions(responses []*crawler.Response) []string {
	versions := []string{}
	for _, response := range responses {
		for _, header := range response.Headers {
			if !(header.Name == "server" && strings.Contains(header.Value, "Apache/")) {
				continue
			}
			matches := regexp.MustCompile(`Apache/(\d+\.\d+\.\d+)`).FindStringSubmatch(header.Value)
			if len(matches) < 2 {
				continue
			}
			versions = append(versions, matches[1])
		}
	}
	return unique(versions)
}

func (s *ApacheSignature) Tags() []string {
	return []string{analyzer.TagWebServer, analyzer.TagReverseProxy}
}
