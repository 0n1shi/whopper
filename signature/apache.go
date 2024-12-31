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

func (s *ApacheSignature) Check(response *crawler.Response) bool {
	for _, header := range response.Headers {
		if header.Name == "server" && strings.Contains(header.Value, "Apache") {
			return true
		}
	}
	return false
}

func (s *ApacheSignature) Version(response *crawler.Response) string {
	for _, header := range response.Headers {
		matches := regexp.MustCompile(`Apache/(\d+\.\d+\.\d+)`).FindStringSubmatch(header.Value)
		if len(matches) < 2 {
			continue
		}
		return matches[1]
	}
	return ""
}

func (s *ApacheSignature) CPE(version string) string {
	return "cpe:/a:apache:http_server:" + version // e.g. cpe:/a:apache:http_server:2.4.57
}

func (s *ApacheSignature) Tags() []string {
	return []string{analyzer.TagWebServer, analyzer.TagReverseProxy}
}
