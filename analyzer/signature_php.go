package analyzer

import (
	"strings"

	"github.com/0n1shi/whopper/crawler"
)

type phpSignature struct{}

var _ signature = (*phpSignature)(nil)

func (s *phpSignature) Name() string {
	return "PHP"
}

func (s *phpSignature) Description() string {
	return "A general-purpose scripting language geared towards web development."
}

func (s *phpSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		for _, header := range response.Headers {
			if header.Name == "Server" && strings.Contains(header.Value, "php") {
				return true
			}
		}
	}
	return false
}

func (s *phpSignature) Versions(responses []*crawler.Response) []string {
	versions := []string{}
	for _, response := range responses {
		for _, header := range response.Headers {
			if header.Name == "Server" && strings.Contains(header.Value, "php/") {
				version := strings.TrimPrefix(header.Value, "php/")
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

func (s *phpSignature) Tags() []string {
	return []string{TagProgrammingLanguage}
}
