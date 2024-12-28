package signature

import (
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
			if header.Name == "Server" && strings.Contains(header.Value, "nginx") {
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

func (s *NginxSignature) Tags() []string {
	return []string{analyzer.TagWebServer, analyzer.TagReverseProxy}
}
