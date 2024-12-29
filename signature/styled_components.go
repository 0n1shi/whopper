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

func (s *StyledComponentsSignature) Check(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeScript {
		return false
	}
	if strings.Contains(response.Body, "data-styled-version") {
		return true
	}
	return false
}

func (s *StyledComponentsSignature) Version(response *crawler.Response) string {
	if response.ResourceType != crawler.ResourceTypeScript {
		return ""
	}
	if !strings.Contains(response.Body, "data-styled-version") {
		return ""
	}
	matches := regexp.MustCompile(`data-styled-version="(\d+\.\d+\.\d+)"`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	matches = regexp.MustCompile(`t\["data-styled-version"\]="(\d+\.\d+\.\d+)"`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	matches = regexp.MustCompile(`\[data-styled-version="(\d+\.\d+\.\d+)"\]`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	matches = regexp.MustCompile(`setAttribute\("data-styled-version","(\d+\.\d+\.\d+)"\)`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	return ""
}

func (s *StyledComponentsSignature) Tags() []string {
	return []string{analyzer.TagLibrary}
}
