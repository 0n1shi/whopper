package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type BackboneJsSignature struct{}

var _ analyzer.Signature = (*BackboneJsSignature)(nil)

func (n *BackboneJsSignature) Name() string {
	return "Backbone.js"
}

func (n *BackboneJsSignature) Description() string {
	return "Backbone.js is a JavaScript rich-client web app framework based on the model–view–controller design paradigm, intended to connect to an API over a RESTful JSON interface."
}

func (s *BackboneJsSignature) Check(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeScript {
		return false
	}
	if strings.Contains(response.Body, "Backbone.history has already been started") {
		return true
	}
	return false
}

func (s *BackboneJsSignature) Version(response *crawler.Response) string {
	if response.ResourceType != crawler.ResourceTypeScript {
		return ""
	}
	if !strings.Contains(response.Body, "Backbone.history has already been started") {
		return ""
	}
	matches := regexp.MustCompile(`t.VERSION="(\d+\.\d+\.\d+)"`).FindStringSubmatch(response.Body)
	if len(matches) < 2 {
		return ""
	}
	return matches[1]
}

func (s *BackboneJsSignature) CPE(version string) string {
	return "cpe:/a:backbone_project:backbone:" + version // e.g. cpe:/a:backbonejs:backbone:1.4.0
}

func (s *BackboneJsSignature) Tags() []string {
	return []string{analyzer.TagLibrary}
}
