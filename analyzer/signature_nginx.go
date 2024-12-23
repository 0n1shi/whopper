package analyzer

import (
	"strings"

	"github.com/0n1shi/whopper/crawler"
)

type nginxSignature struct{}

var _ signature = (*nginxSignature)(nil)

func (s *nginxSignature) Name() string {
	return "Nginx"
}

func (s *nginxSignature) Description() string {
	return "An HTTP web server, reverse proxy, content cache, load balancer, TCP/UDP proxy server, and mail proxy server."
}

func (s *nginxSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		for _, header := range response.Headers {
			if header.Name == "Server" && strings.Contains(header.Value, "nginx") {
				return true
			}
		}
	}
	return false
}

func (s *nginxSignature) Versions(responses []*crawler.Response) []string {
	versions := []string{}
	for _, response := range responses {
		for _, header := range response.Headers {
			if header.Name == "Server" && strings.Contains(header.Value, "nginx/") {
				version := strings.TrimPrefix(header.Value, "nginx/")
				if strings.Contains(version, "(") {
					version = strings.Split(version, "(")[0]
					version = strings.TrimSpace(version)
				}
				versions = append(versions, version)
			}
		}
	}
	return unique(versions)
}

func (s *nginxSignature) Tags() []string {
	return []string{TagWebServer, TagReverseProxy}
}
