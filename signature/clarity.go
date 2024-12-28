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

func (s *ClaritySignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		if response.ResourceType != crawler.ResourceTypeScript {
			continue
		}
		if strings.HasSuffix(response.Url, microsoftClarityfileName) {
			return true
		}
	}
	return false
}

func (s *ClaritySignature) Versions(responses []*crawler.Response) []string {
	versions := []string{}
	for _, response := range responses {
		if response.ResourceType != crawler.ResourceTypeScript {
			continue
		}
		if !strings.HasSuffix(response.Url, microsoftClarityfileName) {
			continue
		}
		lines := strings.Split(response.Body, "\n")
		if len(lines) < 1 {
			continue
		}
		line := lines[0]
		if !strings.HasPrefix(line, microsoftClarityBanner) {
			continue
		}
		version := strings.TrimPrefix(line, microsoftClarityBanner)
		version = strings.Split(version, ":")[0]
		version = strings.TrimSpace(version)
		version = removeVersionPrefix(version)
		versions = append(versions, version)
	}
	return unique(versions)
}

func (s *ClaritySignature) Tags() []string {
	return []string{analyzer.TagAnalytics}
}
