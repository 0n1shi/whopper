package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type StyledComponentsSignature struct{}

var _ analyzer.Signature = (*StyledComponentsSignature)(nil)

func (n *StyledComponentsSignature) Name() string {
	return "styled components"
}

func (n *StyledComponentsSignature) Description() string {
	return "styled-components is the result of wondering how we could enhance CSS for styling React component systems."
}

func (s *StyledComponentsSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		if response.ResourceType != crawler.ResourceTypeScript {
			continue
		}
		if strings.Contains(response.Body, "data-styled-version") {
			return true
		}
	}
	return false
}

func (s *StyledComponentsSignature) Versions(responses []*crawler.Response) []string {
	versions := []string{}
	for _, response := range responses {
		if response.ResourceType != crawler.ResourceTypeScript {
			continue
		}
		if !strings.Contains(response.Body, "data-styled-version") {
			continue
		}
		matches := regexp.MustCompile(`data-styled-version="(\d+\.\d+\.\d+)"`).FindStringSubmatch(response.Body)
		if len(matches) > 1 {
			versions = append(versions, matches[1])
			continue
		}
		matches = regexp.MustCompile(`t\["data-styled-version"\]="(\d+\.\d+\.\d+)"`).FindStringSubmatch(response.Body)
		if len(matches) > 1 {
			versions = append(versions, matches[1])
			continue
		}
		matches = regexp.MustCompile(`\[data-styled-version="(\d+\.\d+\.\d+)"\]`).FindStringSubmatch(response.Body)
		if len(matches) > 1 {
			versions = append(versions, matches[1])
			continue
		}
		matches = regexp.MustCompile(`setAttribute\("data-styled-version","(\d+\.\d+\.\d+)"\)`).FindStringSubmatch(response.Body)
		if len(matches) > 1 {
			versions = append(versions, matches[1])
			continue
		}
	}
	return unique(versions)
}

func (s *StyledComponentsSignature) Tags() []string {
	return []string{analyzer.TagLibrary}
}
