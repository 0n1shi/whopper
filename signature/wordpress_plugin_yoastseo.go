package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

const (
	wordpressPluginYoastSEOBanner = "<!-- This site is optimized with the Yoast SEO plugin"
)

type WordpressPluginYoastSEOSignature struct{}

var _ analyzer.Signature = (*WordpressPluginYoastSEOSignature)(nil)

func (n *WordpressPluginYoastSEOSignature) Name() string {
	return "Yoast SEO"
}

func (n *WordpressPluginYoastSEOSignature) Description() string {
	return "Improve your WordPress SEO: Write better content and have a fully optimized WordPress site using the Yoast SEO plugin."
}

func (s *WordpressPluginYoastSEOSignature) Check(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeDocument {
		return false
	}
	return strings.Contains(response.Body, wordpressPluginYoastSEOBanner)
}

func (s *WordpressPluginYoastSEOSignature) Version(response *crawler.Response) string {
	matches := regexp.MustCompile(`<!-- This site is optimized with the Yoast SEO plugin v(\d+\.\d+) -`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	return ""
}

func (s *WordpressPluginYoastSEOSignature) CPE(version string) string {
	return "cpe:/a:yoast:yoast_seo:" + version
}

func (s *WordpressPluginYoastSEOSignature) Tags() []string {
	return []string{analyzer.TagWordPressPlugin}
}
