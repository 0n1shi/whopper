package analyzer

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/crawler"
)

type signatureBackboneJs struct{}

var _ signature = (*signatureBackboneJs)(nil)

func (n *signatureBackboneJs) Name() string {
	return "Backbone.js"
}

func (n *signatureBackboneJs) Description() string {
	return "Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface."
}

func (s *signatureBackboneJs) Check(responses []*crawler.Response) bool {
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

func (s *signatureBackboneJs) Versions(responses []*crawler.Response) []string {
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

func (s *signatureBackboneJs) Tags() []string {
	return []string{TagLibrary}
}
