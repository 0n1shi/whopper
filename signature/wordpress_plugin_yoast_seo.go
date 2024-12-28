package signature

import (
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

const (
	wordpressPluginYoastSEOBanner = "optimized with the Yoast SEO plugin"
)

type WordpressPluginYoastSEOSignature struct{}

var _ analyzer.Signature = (*WordpressPluginYoastSEOSignature)(nil)

func (n *WordpressPluginYoastSEOSignature) Name() string {
	return "Yoast SEO"
}

func (n *WordpressPluginYoastSEOSignature) Description() string {
	return "Improve your WordPress SEO: Write better content and have a fully optimized WordPress site using the Yoast SEO plugin."
}

func (s *WordpressPluginYoastSEOSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		lines := strings.Split(response.Body, "\n")
		for _, line := range lines {
			if strings.Contains(line, wordpressPluginYoastSEOBanner) {
				return true
			}
		}
	}
	return false
}

func (s *WordpressPluginYoastSEOSignature) Versions(responses []*crawler.Response) []string {
	versions := []string{}
	for _, response := range responses {
		lines := strings.Split(response.Body, "\n")
		for _, line := range lines {
			if strings.Contains(line, wordpressPluginYoastSEOBanner) {
				version := strings.Split(line, wordpressPluginYoastSEOBanner)[1]
				version = strings.Split(version, "-")[0]
				version = strings.TrimSpace(version)
				version = removeVersionPrefix(version)
				versions = append(versions, version)
			}
		}
	}
	return unique(versions)
}

func (s *WordpressPluginYoastSEOSignature) Tags() []string {
	return []string{analyzer.TagWordPressPlugin}
}
