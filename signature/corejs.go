package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type CorejsSignature struct{}

var _ analyzer.Signature = (*CorejsSignature)(nil)

func (n *CorejsSignature) Name() string {
	return "core-js"
}

func (n *CorejsSignature) Description() string {
	return "Modular standard library for JavaScript."
}

func (s *CorejsSignature) Check(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeScript {
		return false
	}
	if strings.Contains(response.Body, "github.com/zloirock/core-js") {
		return true
	}
	return false
}

func (s *CorejsSignature) Version(response *crawler.Response) string {
	matches := regexp.MustCompile(`https://github.com/zloirock/core-js/blob/v(\d+\.\d+\.\d+)/LICENSE`).FindStringSubmatch(response.Body)
	if len(matches) < 2 {
		return ""
	}
	return matches[1]
}

func (s *CorejsSignature) CPE(version string) string {
	return "" // No CPE
}

func (s *CorejsSignature) Tags() []string {
	return []string{analyzer.TagLibrary}
}
