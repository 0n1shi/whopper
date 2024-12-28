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

func (s *NginxSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		for _, header := range response.Headers {
			if header.Name == "server" && strings.Contains(header.Value, "nginx") {
				return true
			}
		}
	}
	return false
}

func (s *NginxSignature) Versions(responses []*crawler.Response) []string {
	versions := []string{}
	for _, response := range responses {
		for _, header := range response.Headers {
			if !(header.Name == "server" && strings.Contains(header.Value, "nginx/")) {
				continue
			}
			matches := regexp.MustCompile(`nginx/(\d+\.\d+\.\d+)`).FindStringSubmatch(header.Value)
			if len(matches) < 2 {
				continue
			}
			versions = append(versions, matches[1])
		}
	}
	return unique(versions)
}

func (s *NginxSignature) Tags() []string {
	return []string{analyzer.TagWebServer, analyzer.TagReverseProxy}
}
