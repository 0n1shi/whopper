package signature

import (
	"net/url"
	"regexp"

	"github.com/0n1shi/whopper/crawler"
)

func Detect(response *crawler.Response, signature *Signature, targetHost string) bool {
	if signature.OnlySameHost {
		resURL, _ := url.Parse(response.URL)
		resHost := resURL.Hostname()

		browserURL, _ := url.Parse(response.BrowserURL)
		pageHost := browserURL.Hostname()

		if resHost != pageHost {
			return false
		}
	}

	pattern := &signature.DetectPattern
	for _, re := range pattern.Bodies {
		if regexp.MustCompile(re).MatchString(response.Body) {
			return true
		}
	}
	for _, re := range pattern.URLs {
		if regexp.MustCompile(re).MatchString(response.URL) {
			return true
		}
	}
	for _, sig := range pattern.Headers {
		for _, header := range response.Headers {
			if header.Value == "" && header.Name == sig.Name { // ignore header value if it's empty
				return true
			}
			if header.Name == sig.Name && regexp.MustCompile(sig.Value).MatchString(header.Value) {
				return true
			}
		}
	}
	for _, sig := range pattern.Cookies {
		for _, cookie := range response.Cookies {
			if cookie.Value == "" && cookie.Name == sig.Name { // ignore cookie value if it's empty
				return true
			}
			if cookie.Name == sig.Name && regexp.MustCompile(sig.Value).MatchString(cookie.Value) {
				return true
			}
		}
	}
	return false
}

func GetVersion(response *crawler.Response, signature *Signature) string {
	pattern := &signature.VersionPattern
	for _, re := range pattern.Bodies {
		matches := regexp.MustCompile(re).FindStringSubmatch(response.Body)
		if len(matches) > 1 {
			return matches[1]
		}
	}
	for _, re := range pattern.URLs {
		matches := regexp.MustCompile(re).FindStringSubmatch(response.URL)
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
	for _, versionFunc := range signature.VersionFuncs {
		version := versionFunc(response)
		if version != "" {
			return version
		}
	}
	return ""
}
