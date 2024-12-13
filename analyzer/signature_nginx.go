package analyzer

import (
	"strings"

	"github.com/0n1shi/whopper/crawler"
)

type nginxSignature struct{}

var _ signature = (*nginxSignature)(nil)

func (n *nginxSignature) Name() string {
	return "nginx"
}

func (s *nginxSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		if server, ok := response.Headers["Server"]; ok {
			if strings.Contains(server, "nginx") {
				return true
			}
		}
	}
	return false
}

func (n *nginxSignature) Versions(responses []*crawler.Response) []string {
	versions := []string{}
	for _, response := range responses {
		if server, ok := response.Headers["Server"]; ok {
			if strings.Contains(server, "nginx/") {
				versions = append(versions, strings.TrimPrefix(server, "nginx/"))
			}
		}
	}
	return unique(versions)
}

func (n *nginxSignature) Tags() []Tag {
	return []Tag{TagWebServer, TagReverseProxy}
}
