package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type AngularJSSignature struct{}

var _ analyzer.Signature = (*AngularJSSignature)(nil)

func (s *AngularJSSignature) Name() string {
	return "AngularJS"
}

func (s *AngularJSSignature) Description() string {
	return "A discontinued free and open-source JavaScript-based web framework for developing single-page applications."
}

func (s *AngularJSSignature) Check(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeScript {
		return false
	}
	if strings.Contains(response.Url, "/angular-") {
		return true
	}
	if strings.Contains(response.Body, "* @license AngularJS") {
		return true
	}
	return false
}

func (s *AngularJSSignature) Version(response *crawler.Response) string {
	matches := regexp.MustCompile(`\* @license AngularJS v(\d+\.\d+\.\d+)`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	return ""
}

func (s *AngularJSSignature) CPE(version string) string {
	return "cpe:/a:angularjs:angular.js:" + version // e.g. cpe:/a:apache:http_server:2.4.57
}

func (s *AngularJSSignature) Tags() []string {
	return []string{analyzer.TagJavaScript, analyzer.TagFramework}
}
