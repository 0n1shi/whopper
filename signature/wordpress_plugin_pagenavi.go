package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type WordpressPluginPageNaviSignature struct{}

var _ analyzer.Signature = (*WordpressPluginPageNaviSignature)(nil)

func (n *WordpressPluginPageNaviSignature) Name() string {
	return "WP-PageNavi"
}

func (n *WordpressPluginPageNaviSignature) Description() string {
	return "Want to replace the old ← Older posts | Newer posts → links with some page links? This plugin provides the wp_pagenavi() template tag which generates fancy pagination links."
}

func (s *WordpressPluginPageNaviSignature) Check(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeStylesheet {
		return false
	}
	if strings.Contains(response.Url, "/plugins/wp-pagenavi") {
		return true
	}
	return strings.Contains(response.Body, "for WP-PageNavi plugin")
}

func (s *WordpressPluginPageNaviSignature) Version(response *crawler.Response) string {
	matches := regexp.MustCompile(`/plugins/wp-pagenavi/pagenavi-css\.css\?ver=([0-9.]+)`).FindStringSubmatch(response.Url)
	if len(matches) > 1 {
		return matches[1]
	}
	return ""
}

func (s *WordpressPluginPageNaviSignature) CPE(version string) string {
	return ""
}

func (s *WordpressPluginPageNaviSignature) Tags() []string {
	return []string{analyzer.TagWordPressPlugin}
}
