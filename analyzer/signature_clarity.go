package analyzer

import (
	"strings"

	"github.com/0n1shi/whopper/crawler"
)

const (
	microsoftClarityfileName = "clarity.js"
	microsoftClarityBanner   = "/* clarity-js"
)

type claritySignature struct{}

var _ signature = (*claritySignature)(nil)

func (n *claritySignature) Name() string {
	return "Microsoft Clarity"
}

func (n *claritySignature) Description() string {
	return "Clarity is a free product that captures how people use your site. Setup is easy and you'll start getting data in minutes."
}

func (s *claritySignature) Check(responses []*crawler.Response) bool {
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

func (s *claritySignature) Versions(responses []*crawler.Response) []string {
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

func (s *claritySignature) Tags() []string {
	return []string{TagAnalytics}
}
