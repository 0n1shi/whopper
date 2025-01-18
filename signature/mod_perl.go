package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type ModPerlSignature struct{}

var _ analyzer.SignatureIf = (*ModPerlSignature)(nil)

func (s *ModPerlSignature) Name() string {
	return "mod_perl"
}

func (s *ModPerlSignature) Description() string {
	return "mod_perl brings together the full power of the Perl programming language and the Apache HTTP server."
}

func (s *ModPerlSignature) Check(response *crawler.Response) bool {
	for _, header := range response.Headers {
		if header.Name == "server" && strings.Contains(header.Value, "mod_perl") {
			return true
		}
	}
	return false
}

func (s *ModPerlSignature) Version(response *crawler.Response) string {
	for _, header := range response.Headers {
		matches := regexp.MustCompile(`mod_perl/(\d+\.\d+\.\d+)`).FindStringSubmatch(header.Value)
		if len(matches) > 1 {
			return matches[1]
		}
	}
	return ""
}

func (s *ModPerlSignature) CPE(version string) string {
	return "cpe:/a:apache:mod_perl:" + version
}

func (s *ModPerlSignature) Tags() []string {
	return []string{analyzer.TagWebServerExtension}
}
