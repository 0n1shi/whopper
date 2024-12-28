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

func (s *BackboneJsSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		if response.ResourceType != crawler.ResourceTypeScript {
			continue
		}
		if strings.Contains(response.Body, "Backbone.history has already been started") {
			return true
		}
	}
	return false
}

func (s *BackboneJsSignature) Versions(responses []*crawler.Response) []string {
	versions := []string{}
	for _, response := range responses {
		if response.ResourceType != crawler.ResourceTypeScript {
			continue
		}
		if !strings.Contains(response.Body, "Backbone.history has already been started") {
			continue
		}
		matches := regexp.MustCompile(`t.VERSION="(\d+\.\d+\.\d+)"`).FindStringSubmatch(response.Body)
		if len(matches) < 2 {
			continue
		}
		versions = append(versions, matches[1])
	}
	return unique(versions)
}

func (s *BackboneJsSignature) Tags() []string {
	return []string{analyzer.TagLibrary}
}
