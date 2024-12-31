package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type JqueryCookieSignature struct{}

var _ analyzer.Signature = (*JqueryCookieSignature)(nil)

func (n *JqueryCookieSignature) Name() string {
	return "jQuery Cookie"
}

func (n *JqueryCookieSignature) Description() string {
	return "A simple, lightweight jQuery plugin for reading, writing and deleting cookies."
}

func (s *JqueryCookieSignature) Check(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeDocument {
		return false
	}
	nodes := getHTMLTags(response.Body, "script")
	for _, node := range nodes {
		if attr, ok := getAttribute(node, "src"); ok {
			if strings.Contains(attr, "jquery-cookie") {
				return true
			}
		}
	}
	return false
}

func (s *JqueryCookieSignature) Version(response *crawler.Response) string {
	if response.ResourceType != crawler.ResourceTypeDocument {
		return ""
	}
	re := regexp.MustCompile(`jquery-cookie[@/]\d+\.\d+\.\d+`)
	nodes := getHTMLTags(response.Body, "script")
	for _, node := range nodes {
		attr, ok := getAttribute(node, "src")
		if !ok {
			continue
		}
		matches := re.FindStringSubmatch(attr)
		if len(matches) < 2 {
			continue
		}
		return matches[1]
	}
	return ""
}

func (s *JqueryCookieSignature) CPE(version string) string {
	return "cpe:/a:jquery.cookie_project:jquery.cookie:" + version // e.g. cpe:/a:jquery.cookie_project:jquery.cookie:1.4.1
}

func (s *JqueryCookieSignature) Tags() []string {
	return []string{analyzer.TagLibrary}
}
