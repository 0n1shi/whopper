package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type NginxSignature struct{}

var _ analyzer.Signature = (*NginxSignature)(nil)

func (s *NginxSignature) Name() string {
	return "Nginx"
}

func (s *NginxSignature) Description() string {
	return "An HTTP web server, reverse proxy, content cache, load balancer, TCP/UDP proxy server, and mail proxy server."
}

func (s *NginxSignature) Check(response *crawler.Response) bool {
	for _, header := range response.Headers {
		if header.Name == "server" && strings.Contains(header.Value, "nginx") {
			return true
		}
	}
	return false
}

func (s *NginxSignature) Version(response *crawler.Response) string {
	for _, header := range response.Headers {
		if !(header.Name == "server" && strings.Contains(header.Value, "nginx/")) {
			continue
		}
		matches := regexp.MustCompile(`nginx/(\d+\.\d+\.\d+)`).FindStringSubmatch(header.Value)
		if len(matches) < 2 {
			continue
		}
		return matches[1]
	}
	return ""
}

func (s *NginxSignature) CPE(version string) string {
	return "cpe:/a:nginx:nginx:" + version // e.g. cpe:/a:nginx:nginx:1.21.0
}

func (s *NginxSignature) Tags() []string {
	return []string{analyzer.TagWebServer, analyzer.TagReverseProxy}
}
