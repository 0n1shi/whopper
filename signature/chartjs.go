package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type ChartJsSignature struct{}

var _ analyzer.Signature = (*ChartJsSignature)(nil)

func (n *ChartJsSignature) Name() string {
	return "Chart.js"
}

func (n *ChartJsSignature) Description() string {
	return "Simple yet flexible JavaScript charting library for the modern web."
}

func (s *ChartJsSignature) Check(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeScript {
		return false
	}
	if strings.Contains(response.Url, "chart.js") {
		return true
	}
	if strings.Contains(response.Body, "Chart.js") {
		return true
	}
	return false
}

func (s *ChartJsSignature) Version(response *crawler.Response) string {
	matches := regexp.MustCompile(`Chart\.js v(\d+\.\d+\.\d+)`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	return ""
}

func (s *ChartJsSignature) CPE(version string) string {
	return "cpe:/a:chartjs:chartjs:" + version // e.g. cpe:/a:chartjs:chartjs:2.9.4
}

func (s *ChartJsSignature) Tags() []string {
	return []string{analyzer.TagLibrary, analyzer.TagJavaScript}
}
