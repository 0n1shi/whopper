package signature

import (
	"regexp"
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

func (s *PhpSignature) Check(response *crawler.Response) bool {
	for _, header := range response.Headers {
		if (header.Name == "server" || header.Name == "x-powered-by") && strings.Contains(header.Value, "PHP") {
			return true
		}
	}
	return false
}

func (s *PhpSignature) Version(response *crawler.Response) string {
	for _, header := range response.Headers {
		matches := regexp.MustCompile(`PHP/(\d+\.\d+\.\d+)`).FindStringSubmatch(header.Value)
		if len(matches) > 1 {
			return matches[1]
		}
	}
	return ""
}

func (s *PhpSignature) CPE(version string) string {
	return "cpe:/a:php:php:" + version // e.g. cpe:/a:php:php:8.0.11
}

func (s *PhpSignature) Tags() []string {
	return []string{analyzer.TagProgrammingLanguage}
}
