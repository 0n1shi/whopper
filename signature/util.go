package signature

import (
	"net/url"
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/crawler"
	"golang.org/x/net/html"
)

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

func Detect(response *crawler.Response, signature *Signature, targetHost string) bool {
	if signature.OnlySameHost {
		resURL, _ := url.Parse(response.Url)
		resHost := resURL.Hostname()
		if resHost != targetHost {
			return false
		}
	}

	pattern := &signature.DetectPattern
	for _, re := range pattern.Bodies {
		if regexp.MustCompile(re).MatchString(response.Body) {
			return true
		}
	}
	for _, re := range pattern.Urls {
		if regexp.MustCompile(re).MatchString(response.Url) {
			return true
		}
	}
	for _, sig := range pattern.Headers {
		for _, header := range response.Headers {
			if header.Name == sig.Name && regexp.MustCompile(sig.Value).MatchString(header.Value) {
				return true
			}
		}
	}
	for _, sig := range pattern.Cookies {
		for _, cookie := range response.Cookies {
			if cookie.Name == sig.Name && regexp.MustCompile(sig.Value).MatchString(cookie.Value) {
				return true
			}
		}
	}
	return false
}

func ExtractVersion(response *crawler.Response, signature *Signature) string {
	pattern := &signature.VersionPattern
	for _, re := range pattern.Bodies {
		matches := regexp.MustCompile(re).FindStringSubmatch(response.Body)
		if len(matches) > 1 {
			return matches[1]
		}
	}
	for _, re := range pattern.Urls {
		matches := regexp.MustCompile(re).FindStringSubmatch(response.Url)
		if len(matches) > 1 {
			return matches[1]
		}
	}
	for _, sig := range pattern.Headers {
		for _, header := range response.Headers {
			if header.Name == sig.Name {
				matches := regexp.MustCompile(sig.Value).FindStringSubmatch(header.Value)
				if len(matches) > 1 {
					return matches[1]
				}
			}
		}
	}
	for _, sig := range pattern.Cookies {
		for _, cookie := range response.Cookies {
			if cookie.Name == sig.Name {
				matches := regexp.MustCompile(sig.Value).FindStringSubmatch(cookie.Value)
				if len(matches) > 1 {
					return matches[1]
				}
			}
		}
	}
	return ""
}
