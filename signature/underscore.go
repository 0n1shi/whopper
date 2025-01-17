package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type UnderscoreSignature struct{}

var _ analyzer.Signature = (*UnderscoreSignature)(nil)

func (n *UnderscoreSignature) Name() string {
	return "Underscore.js"
}

func (n *UnderscoreSignature) Description() string {
	return "A JavaScript library that provides a whole mess of useful functional programming helpers without extending any built-in objects."
}

func (s *UnderscoreSignature) Check(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeScript {
		return false
	}
	if strings.Contains(response.Url, "underscore") {
		return true
	}
	return strings.Contains(response.Body, "Underscore.js")
}

func (s *UnderscoreSignature) Version(response *crawler.Response) string {
	matches := regexp.MustCompile(`Underscore\.js (\d+\.\d+\.\d+)`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	return ""
}

func (s *UnderscoreSignature) CPE(version string) string {
	return "cpe:/a:underscorejs:underscore:" + version
}

func (s *UnderscoreSignature) Tags() []string {
	return []string{analyzer.TagJavaScript, analyzer.TagLibrary}
}
