package signature

import (
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
	return false
}

func (s *ClaritySignature) Version(response *crawler.Response) string {
	if response.ResourceType != crawler.ResourceTypeScript {
		return ""
	}
	if !strings.HasSuffix(response.Url, microsoftClarityfileName) {
		return ""
	}
	lines := strings.Split(response.Body, "\n")
	if len(lines) < 1 {
		return ""
	}
	line := lines[0]
	if !strings.HasPrefix(line, microsoftClarityBanner) {
		return ""
	}
	version := strings.TrimPrefix(line, microsoftClarityBanner)
	version = strings.Split(version, ":")[0]
	version = strings.TrimSpace(version)
	version = removeVersionPrefix(version)
	return version
}

func (s *ClaritySignature) Tags() []string {
	return []string{analyzer.TagAnalytics}
}
