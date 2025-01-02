package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type JquerySignature struct{}

var _ analyzer.Signature = (*JquerySignature)(nil)

func (n *JquerySignature) Name() string {
	return "jQuery"
}

func (n *JquerySignature) Description() string {
	return "A fast, small, and feature-rich JavaScript library."
}

func (s *JquerySignature) Check(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeScript {
		return false
	}
	if strings.Contains(response.Url, "jquery") {
		return true
	}
	return strings.Contains(response.Body, "jQuery")
}

func (s *JquerySignature) Version(response *crawler.Response) string {
	matches := regexp.MustCompile(`jquery[@/-](\d+\.\d+\.\d+)`).FindStringSubmatch(response.Url)
	if len(matches) > 1 {
		return matches[1]
	}
	matches = regexp.MustCompile(`jQuery v(\d+\.\d+\.\d+)`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	matches = regexp.MustCompile(`jQuery JavaScript Library v(\d+\.\d+\.\d+)`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	matches = regexp.MustCompile(`var C="(\d+\.\d+\.\d+)"`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	return ""
}

func (s *JquerySignature) CPE(version string) string {
	return "cpe:/a:jquery:jquery:" + version // e.g. cpe:/a:jquery:jquery:3.6.0
}

func (s *JquerySignature) Tags() []string {
	return []string{analyzer.TagLibrary}
}
