package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type BootstrapSignature struct{}

var _ analyzer.SignatureIf = (*BootstrapSignature)(nil)

func (s *BootstrapSignature) Name() string {
	return "Bootstrap"
}

func (s *BootstrapSignature) Description() string {
	return "Powerful, extensible, and feature-packed frontend toolkit. Build and customize with Sass, utilize prebuilt grid system and components, and bring projects to life with powerful JavaScript plugins."
}

func (s *BootstrapSignature) Check(response *crawler.Response) bool {
	urlPatterns := []string{
		"/bootstrap/",
		"/bootstrap.min.css",
		"/bootstrap.min.js",
	}
	for _, urlPattern := range urlPatterns {
		if strings.Contains(response.Url, urlPattern) {
			return true
		}
	}

	if response.ResourceType != crawler.ResourceTypeStylesheet {
		return false
	}
	return strings.Contains(response.Body, "* Bootstrap")
}

func (s *BootstrapSignature) Version(response *crawler.Response) string {
	matches := regexp.MustCompile(`\/bootstrap\/(\d+\.\d+\.\d+)`).FindStringSubmatch(response.Url)
	if len(matches) > 1 {
		return matches[1]
	}

	matches = regexp.MustCompile(`\* Bootstrap v(\d+\.\d+\.\d+)`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}

	return ""
}

func (s *BootstrapSignature) CPE(version string) string {
	return "cpe:/a:getbootstrap:bootstrap:" + version
}

func (s *BootstrapSignature) Tags() []string {
	return []string{analyzer.TagCSSFramework}
}
