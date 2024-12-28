package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type JquerySignature struct{}

var _ analyzer.Signature = (*JquerySignature)(nil)

func (n *JquerySignature) Name() string {
	return "jQuery"
}

func (n *JquerySignature) Description() string {
	return "A fast, small, and feature-rich JavaScript library."
}

func (s *JquerySignature) Check(responses []*crawler.Response) bool {
	// Check if there is a script tag to load jQuery in the HTML
	for _, response := range responses {
		if hasScriptTagToLoadJQueryInHTML(response) {
			return true
		}
	}

	// Check if it is a minified jQuery
	for _, response := range responses {
		if isMinifiedJQuery(response) {
			return true
		}
	}

	return false
}

func (s *JquerySignature) Versions(responses []*crawler.Response) []string {
	versions := []string{}

	// Check if there is a script tag to load jQuery in the HTML
	for _, response := range responses {
		if !hasScriptTagToLoadJQueryInHTML(response) {
			continue
		}
		foundVers := tryToGetJQueryVersionFromScriptTag(response)
		if len(foundVers) > 0 {
			versions = append(versions, foundVers...)
		}
	}

	// Check if it is a minified jQuery
	for _, response := range responses {
		if !isMinifiedJQuery(response) {
			continue
		}
		foundVer := tryToGetJQueryVersionFromMinified(response)
		if foundVer != "" {
			versions = append(versions, foundVer)
		}
	}

	return unique(versions)
}

func (s *JquerySignature) Tags() []string {
	return []string{analyzer.TagLibrary}
}

/**
 * Check if there is a script tag to load jQuery in the HTML
 */
func hasScriptTagToLoadJQueryInHTML(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeDocument {
		return false
	}
	nodes := getHTMLTags(response.Body, "script")
	for _, node := range nodes {
		if attr, ok := getAttribute(node, "src"); ok {
			if strings.Contains(attr, "jquery") {
				return true
			}
		}
	}
	return false
}

func tryToGetJQueryVersionFromScriptTag(response *crawler.Response) []string {
	versions := []string{}
	nodes := getHTMLTags(response.Body, "script")
	for _, node := range nodes {
		attr, ok := getAttribute(node, "src")
		if !ok {
			continue
		}
		matches := regexp.MustCompile(`jquery[@/]\d+\.\d+\.\d+`).FindAllString(attr, -1)
		for _, match := range matches {
			if strings.Contains(match, "@") {
				match = strings.Split(match, "@")[1]
			}
			if strings.Contains(match, "/") {
				match = strings.Split(match, "/")[1]
			}
			versions = append(versions, match)
		}
	}
	return versions
}

func isMinifiedJQuery(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeScript {
		return false
	}
	return strings.Contains(response.Body, "jQuery requires a window with a document")
}

func tryToGetJQueryVersionFromMinified(response *crawler.Response) string {
	matches := regexp.MustCompile(`var C="(\d+\.\d+\.\d+)"`).FindStringSubmatch(response.Body)
	if len(matches) < 2 {
		return ""
	}
	return matches[1]
}
