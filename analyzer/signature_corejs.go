package analyzer

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/crawler"
)

type corejsSignature struct{}

var _ signature = (*corejsSignature)(nil)

func (n *corejsSignature) Name() string {
	return "core-js"
}

func (n *corejsSignature) Description() string {
	return "Modular standard library for JavaScript."
}

func (s *corejsSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		if response.ResourceType != crawler.ResourceTypeScript {
			continue
		}
		if strings.Contains(response.Body, "github.com/zloirock/core-js") {
			return true
		}
	}
	return false
}

func (s *corejsSignature) Versions(responses []*crawler.Response) []string {
	versions := []string{}
	for _, response := range responses {
		if response.ResourceType != crawler.ResourceTypeScript {
			continue
		}
		if !strings.Contains(response.Body, "github.com/zloirock/core-js") {
			continue
		}
		matches := regexp.MustCompile(`https://github.com/zloirock/core-js/blob/v(\d+\.\d+\.\d+)/LICENSE`).FindStringSubmatch(response.Body)
		if len(matches) < 2 {
			continue
		}
		versions = append(versions, matches[1])
	}
	return unique(versions)
}

func (s *corejsSignature) Tags() []string {
	return []string{TagLibrary}
}
