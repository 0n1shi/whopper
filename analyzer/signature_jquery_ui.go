package analyzer

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/crawler"
)

const (
	jqueryUiBanner = "jQuery UI CSS Framework"
)

type jqueryUiSignature struct{}

var _ signature = (*jqueryUiSignature)(nil)

func (n *jqueryUiSignature) Name() string {
	return "jQuery UI CSS Framework"
}

func (n *jqueryUiSignature) Description() string {
	return "jQuery UI is a curated set of user interface interactions, effects, widgets, and themes built on top of the jQuery JavaScript Library."
}

func (s *jqueryUiSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		if response.ResourceType != crawler.ResourceTypeStylesheet {
			continue
		}
		for _, line := range strings.Split(response.Body, "\n") {
			if strings.Contains(line, jqueryUiBanner) {
				return true
			}
		}
	}
	return false
}

func (s *jqueryUiSignature) Versions(responses []*crawler.Response) []string {
	versions := []string{}
	for _, response := range responses {
		if response.ResourceType != crawler.ResourceTypeStylesheet {
			continue
		}
		for _, line := range strings.Split(response.Body, "\n") {
			if strings.Contains(line, jqueryUiBanner) {
				re := regexp.MustCompile(fmt.Sprintf(`%s (\d+\.\d+\.\d+)`, jqueryUiBanner))
				matches := re.FindStringSubmatch(line)
				if len(matches) > 1 {
					versions = append(versions, matches[1])
				}
			}
		}
	}

	return unique(versions)
}

func (s *jqueryUiSignature) Tags() []string {
	return []string{TagLibrary}
}
