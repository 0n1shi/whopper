package analyzer

import (
	"strings"

	"github.com/0n1shi/whopper/crawler"
)

type phpSignature struct{}

var _ signature = (*phpSignature)(nil)

func (s *phpSignature) Name() string {
	return "php"
}

func (s *phpSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		if server, ok := response.Headers["Server"]; ok {
			if strings.Contains(server, "php") {
				return true
			}
		}
	}
	return false
}

func (s *phpSignature) Versions(responses []*crawler.Response) []string {
	versions := []string{}
	for _, response := range responses {
		if server, ok := response.Headers["Server"]; ok {
			if strings.Contains(server, "php/") {
				versions = append(versions, strings.TrimPrefix(server, "php/"))
			}
		}
	}
	return unique(versions)
}

func (s *phpSignature) Tags() []Tag {
	return []Tag{TagProgrammingLanguage}
}
