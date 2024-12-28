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

func (s *CorejsSignature) Check(responses []*crawler.Response) bool {
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

func (s *CorejsSignature) Versions(responses []*crawler.Response) []string {
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

func (s *CorejsSignature) Tags() []string {
	return []string{analyzer.TagLibrary}
}
