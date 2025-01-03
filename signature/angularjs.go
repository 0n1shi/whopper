package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type AngularJsSignature struct{}

var _ analyzer.Signature = (*AngularJsSignature)(nil)

func (s *AngularJsSignature) Name() string {
	return "AngularJS"
}

func (s *AngularJsSignature) Description() string {
	return "A discontinued free and open-source JavaScript-based web framework for developing single-page applications."
}

func (s *AngularJsSignature) Check(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeScript {
		return false
	}
	if strings.Contains(response.Url, "/angular-") {
		return true
	}
	if strings.Contains(response.Body, "* @license AngularJS") {
		return true
	}
	if strings.Contains(response.Body, "angular") {
		return true
	}
	return false
}

func (s *AngularJsSignature) Version(response *crawler.Response) string {
	matches := regexp.MustCompile(`\* @license AngularJS v(\d+\.\d+\.\d+)`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	matches = regexp.MustCompile(`http:\/\/errors.angularjs.org\/(\d+\.\d+\.\d+(-rc\.\d+)?)`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	return ""
}

func (s *AngularJsSignature) CPE(version string) string {
	return "cpe:/a:angularjs:angular.js:" + version // e.g. cpe:/a:apache:http_server:2.4.57
}

func (s *AngularJsSignature) Tags() []string {
	return []string{analyzer.TagJavaScript, analyzer.TagFramework}
}
