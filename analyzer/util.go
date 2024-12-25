package analyzer

import (
	"strings"

	"golang.org/x/net/html"
)

func unique(list []string) []string {
	seen := map[string]struct{}{}
	uniq := []string{}
	for _, s := range list {
		if _, ok := seen[s]; ok {
			continue
		}
		seen[s] = struct{}{}
		uniq = append(uniq, s)
	}
	return uniq
}

func getHTMLTags(str string, tag string) []*html.Node {
	doc, err := html.Parse(strings.NewReader(str))
	if err != nil {
		return nil
	}

	var f func(*html.Node)
	var nodes []*html.Node
	f = func(n *html.Node) {
		if n.Type == html.ElementNode && n.Data == tag {
			nodes = append(nodes, n)
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			f(c)
		}
	}
	f(doc)

	return nodes
}

func getAttribute(node *html.Node, key string) (string, bool) {
	for _, attr := range node.Attr {
		if attr.Key == key {
			return attr.Val, true
		}
	}
	return "", false
}

func removeVersionPrefix(version string) string {
	return strings.TrimPrefix(version, "v")
}
