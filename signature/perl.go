package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type PerlSignature struct{}

var _ analyzer.SignatureIf = (*PerlSignature)(nil)

func (s *PerlSignature) Name() string {
	return "Perl"
}

func (s *PerlSignature) Description() string {
	return "Perl is a highly capable, feature-rich programming language with over 37 years of development."
}

func (s *PerlSignature) Check(response *crawler.Response) bool {
	for _, header := range response.Headers {
		if header.Name == "server" && strings.Contains(header.Value, "Perl") {
			return true
		}
	}
	return false
}

func (s *PerlSignature) Version(response *crawler.Response) string {
	for _, header := range response.Headers {
		matches := regexp.MustCompile(`Perl/v?(\d+\.\d+\.\d+)`).FindStringSubmatch(header.Value)
		if len(matches) > 1 {
			return matches[1]
		}
	}
	return ""
}

func (s *PerlSignature) CPE(version string) string {
	return "cpe:/a:perl:perl:" + version
}

func (s *PerlSignature) Tags() []string {
	return []string{analyzer.TagProgrammingLanguage}
}
