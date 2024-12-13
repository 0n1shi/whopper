package analyzer

import (
	"strings"

	"github.com/0n1shi/whopper/crawler"
)

type apacheSignature struct{}

var _ signature = (*apacheSignature)(nil)

func (n *apacheSignature) Name() string {
	return "apache"
}

func (s *apacheSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		if server, ok := response.Headers["Server"]; ok {
			if strings.Contains(server, "Apache") {
				return true
			}
		}
	}
	return false
}

func (s *apacheSignature) Versions(responses []*crawler.Response) []string {
	versions := []string{}
	for _, response := range responses {
		if server, ok := response.Headers["Server"]; ok {
			if strings.Contains(server, "Apache/") {
				versions = append(versions, strings.TrimPrefix(server, "Apache/"))
			}
		}
	}
	return unique(versions)
}

func (s *apacheSignature) Tags() []Tag {
	return []Tag{TagWebServer, TagReverseProxy}
}
