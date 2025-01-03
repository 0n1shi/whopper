package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type MomentJsSignature struct{}

var _ analyzer.Signature = (*MomentJsSignature)(nil)

func (n *MomentJsSignature) Name() string {
	return "Moment.js"
}

func (n *MomentJsSignature) Description() string {
	return "Parse, validate, manipulate, and display dates and times in JavaScript."
}

func (s *MomentJsSignature) Check(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeScript {
		return false
	}
	if strings.Contains(response.Url, "moment") {
		return true
	}
	return strings.Contains(response.Body, "moment")
}

func (s *MomentJsSignature) Version(response *crawler.Response) string {
	matches := regexp.MustCompile(`\/\/! version : (\d+\.\d+\.\d+)`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	matches = regexp.MustCompile(`VERSION = '(\d+\.\d+\.\d+)'`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	matches = regexp.MustCompile(`b.version="(\d+\.\d+\.\d+)"`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	return ""
}

func (s *MomentJsSignature) CPE(version string) string {
	return "cpe:/a:jqueryui:jquery_ui:" + version // e.g. cpe:/a:jqueryui:jquery_ui:1.12.1
}

func (s *MomentJsSignature) Tags() []string {
	return []string{analyzer.TagLibrary}
}
