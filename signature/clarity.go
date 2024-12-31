package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

const (
	microsoftClarityfileName = "clarity.js"
	microsoftClarityBanner   = "/* clarity-js"
)

type ClaritySignature struct{}

var _ analyzer.Signature = (*ClaritySignature)(nil)

func (n *ClaritySignature) Name() string {
	return "Microsoft Clarity"
}

func (n *ClaritySignature) Description() string {
	return "Clarity is a free product that captures how people use your site. Setup is easy and you'll start getting data in minutes."
}

func (s *ClaritySignature) Check(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeScript {
		return false
	}
	if strings.HasSuffix(response.Url, microsoftClarityfileName) {
		return true
	}
	if strings.Contains(response.Body, microsoftClarityBanner) {
		return true
	}
	return false
}

func (s *ClaritySignature) Version(response *crawler.Response) string {
	// https://www.clarity.ms/s/0.7.59/clarity.js
	matches := regexp.MustCompile(`www\.clarity\.ms\/s\/(\d+\.\d+\.\d+)\/clarity\.js`).FindStringSubmatch(response.Url)
	if len(matches) > 1 {
		return matches[1]
	}

	// /* clarity-js v0.7.59: https://...
	matches = regexp.MustCompile(`\/\* clarity-js v([0-9.]+):`).FindStringSubmatch(response.Body)
	if len(matches) < 2 {
		return ""
	}
	return matches[1]
}

func (s *ClaritySignature) CPE(version string) string {
	return "cpe:/a:microsoft:clarity:" + version
}

func (s *ClaritySignature) Tags() []string {
	return []string{analyzer.TagAnalytics}
}
