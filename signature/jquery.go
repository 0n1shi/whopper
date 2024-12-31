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

func (s *JquerySignature) Check(response *crawler.Response) bool {
	if strings.Contains(response.Url, "jquery") {
		return true
	}

	if strings.Contains(response.Body, "jQuery v") {
		return true
	}

	// Check if there is a script tag to load jQuery in the HTML
	if hasScriptTagToLoadJQueryInHTML(response) {
		return true
	}

	// Check if it is a minified jQuery
	if isMinifiedJQuery(response) {
		return true
	}

	return false
}

func (s *JquerySignature) Version(response *crawler.Response) string {
	if strings.Contains(response.Url, "jquery") {
		matches := regexp.MustCompile(`jquery[@/-](\d+\.\d+\.\d+)`).FindStringSubmatch(response.Url)
		if len(matches) > 1 {
			return matches[1]
		}
	}

	matches := regexp.MustCompile(`jQuery v(\d+\.\d+\.\d+)`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}

	foundVer := getJQueryVersionFromScriptTag(response)
	if foundVer != "" {
		return foundVer
	}

	foundVer = getJQueryVersionFromMinified(response)
	if foundVer != "" {
		return foundVer
	}

	return ""
}

func (s *JquerySignature) CPE(version string) string {
	return "cpe:/a:jquery:jquery:" + version // e.g. cpe:/a:jquery:jquery:3.6.0
}

func (s *JquerySignature) Tags() []string {
	return []string{analyzer.TagLibrary}
}

/**
 * HTML script tag to load jQuery
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

func getJQueryVersionFromScriptTag(response *crawler.Response) string {
	nodes := getHTMLTags(response.Body, "script")
	for _, node := range nodes {
		attr, ok := getAttribute(node, "src")
		if !ok {
			continue
		}
		matches := regexp.MustCompile(`jquery[@/-](\d+\.\d+\.\d+)`).FindStringSubmatch(attr)
		if len(matches) < 2 {
			continue
		}
		return matches[1]
	}
	return ""
}

/**
 * minified jQuery script
 */
func isMinifiedJQuery(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeScript {
		return false
	}
	return strings.Contains(response.Body, "jQuery requires a window with a document")
}

func getJQueryVersionFromMinified(response *crawler.Response) string {
	matches := regexp.MustCompile(`var C="(\d+\.\d+\.\d+)"`).FindStringSubmatch(response.Body)
	if len(matches) < 2 {
		return ""
	}
	return matches[1]
}
