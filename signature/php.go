package signature

import (
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type PhpSignature struct{}

var _ analyzer.Signature = (*PhpSignature)(nil)

func (s *PhpSignature) Name() string {
	return "PHP"
}

func (s *PhpSignature) Description() string {
	return "A general-purpose scripting language geared towards web development."
}

func (s *PhpSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		for _, header := range response.Headers {
			if header.Name == "server" && strings.Contains(header.Value, "php") {
				return true
			}
		}
	}
	return false
}

func (s *PhpSignature) Versions(responses []*crawler.Response) []string {
	versions := []string{}
	for _, response := range responses {
		for _, header := range response.Headers {
			if header.Name == "server" && strings.Contains(header.Value, "php/") {
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

func (s *PhpSignature) Tags() []string {
	return []string{analyzer.TagProgrammingLanguage}
}
