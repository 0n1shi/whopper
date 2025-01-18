package signature

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

const (
	jqueryUiBanner = "jQuery UI CSS Framework"
)

type JqueryUiSignature struct{}

var _ analyzer.SignatureIf = (*JqueryUiSignature)(nil)

func (n *JqueryUiSignature) Name() string {
	return "jQuery UI CSS Framework"
}

func (n *JqueryUiSignature) Description() string {
	return "jQuery UI is a curated set of user interface interactions, effects, widgets, and themes built on top of the jQuery JavaScript Library."
}

func (s *JqueryUiSignature) Check(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeStylesheet {
		return false
	}
	for _, line := range strings.Split(response.Body, "\n") {
		if strings.Contains(line, jqueryUiBanner) {
			return true
		}
	}
	return false
}

func (s *JqueryUiSignature) Version(response *crawler.Response) string {
	for _, line := range strings.Split(response.Body, "\n") {
		if strings.Contains(line, jqueryUiBanner) {
			re := regexp.MustCompile(fmt.Sprintf(`%s (\d+\.\d+\.\d+)`, jqueryUiBanner))
			matches := re.FindStringSubmatch(line)
			if len(matches) > 1 {
				return matches[1]
			}
		}
	}
	return ""
}

func (s *JqueryUiSignature) CPE(version string) string {
	return "cpe:/a:jqueryui:jquery_ui:" + version // e.g. cpe:/a:jqueryui:jquery_ui:1.12.1
}

func (s *JqueryUiSignature) Tags() []string {
	return []string{analyzer.TagLibrary}
}
