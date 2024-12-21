package analyzer

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/crawler"
)

type jqueryCookieSignature struct{}

var _ signature = (*jqueryCookieSignature)(nil)

func (n *jqueryCookieSignature) Name() string {
	return "jQuery Cookie"
}

func (n *jqueryCookieSignature) Description() string {
	return "A simple, lightweight jQuery plugin for reading, writing and deleting cookies."
}

func (s *jqueryCookieSignature) Check(responses []*crawler.Response) bool {
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

func (s *jqueryCookieSignature) Versions(responses []*crawler.Response) []string {
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

func (s *jqueryCookieSignature) Tags() []Tag {
	return []Tag{TagLibrary}
}
