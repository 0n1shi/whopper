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

func (s *JqueryCookieSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		if response.ResourceType != crawler.ResourceTypeDocument {
			continue
		}
		nodes := getHTMLTags(response.Body, "script")
		for _, node := range nodes {
			if attr, ok := getAttribute(node, "src"); ok {
				if strings.Contains(attr, "jquery-cookie") {
					return true
				}
			}
		}
	}
	return false
}

func (s *JqueryCookieSignature) Versions(responses []*crawler.Response) []string {
	re := regexp.MustCompile(`jquery-cookie[@/]\d+\.\d+\.\d+`)
	versions := []string{}
	for _, response := range responses {
		if response.ResourceType != crawler.ResourceTypeDocument {
			continue
		}
		nodes := getHTMLTags(response.Body, "script")
		for _, node := range nodes {
			attr, ok := getAttribute(node, "src")
			if !ok {
				continue
			}
			matches := re.FindAllString(attr, -1)
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
	}

	return unique(versions)
}

func (s *JqueryCookieSignature) Tags() []string {
	return []string{analyzer.TagLibrary}
}
