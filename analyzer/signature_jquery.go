package analyzer

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/crawler"
)

type jquerySignature struct{}

var _ signature = (*jquerySignature)(nil)

func (n *jquerySignature) Name() string {
	return "jQuery"
}

func (n *jquerySignature) Description() string {
	return "A fast, small, and feature-rich JavaScript library."
}

func (s *jquerySignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		if response.ResourceType != crawler.ResourceTypeDocument {
			continue
		}
		nodes := getHTMLTags(response.Body, "script")
		for _, node := range nodes {
			if attr, ok := getAttribute(node, "src"); ok {
				if strings.Contains(attr, "jquery") {
					return true
				}
			}
		}
	}
	return false
}

func (s *jquerySignature) Versions(responses []*crawler.Response) []string {
	re := regexp.MustCompile(`jquery[@/]\d+\.\d+\.\d+`)
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

func (s *jquerySignature) Tags() []Tag {
	return []Tag{TagLibrary}
}
