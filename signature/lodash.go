package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type LodashSignature struct{}

var _ analyzer.Signature = (*LodashSignature)(nil)

func (n *LodashSignature) Name() string {
	return "Lodash"
}

func (n *LodashSignature) Description() string {
	return "A modern JavaScript utility library delivering modularity, performance & extras."
}

func (s *LodashSignature) Check(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeScript {
		return false
	}
	if strings.Contains(response.Url, "lodash") {
		return true
	}
	if strings.Contains(response.Body, "lodash") {
		return true
	}
	return false
}

func (s *LodashSignature) Version(response *crawler.Response) string {
	matches := regexp.MustCompile(`var VERSION = '(\d+\.\d+\.\d+)'`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	return ""
}

func (s *LodashSignature) CPE(version string) string {
	return "cpe:/a:lodash:lodash:" + version // e.g. cpe:/a:lodash:lodash:4.17.21
}

func (s *LodashSignature) Tags() []string {
	return []string{analyzer.TagLibrary}
}
