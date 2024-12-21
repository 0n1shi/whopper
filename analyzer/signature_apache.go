package analyzer

import (
	"strings"

	"github.com/0n1shi/whopper/crawler"
)

type apacheSignature struct{}

var _ signature = (*apacheSignature)(nil)

func (n *apacheSignature) Name() string {
	return "Apache"
}

func (n *apacheSignature) Description() string {
	return "A free and open-source cross-platform web server, released under the terms of Apache License 2.0."
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
				version := strings.TrimPrefix(server, "Apache/")
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

func (s *apacheSignature) Tags() []string {
	return []string{TagWebServer, TagReverseProxy}
}
