package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type JqueryBxSliderSignature struct{}

var _ analyzer.Signature = (*JqueryBxSliderSignature)(nil)

func (n *JqueryBxSliderSignature) Name() string {
	return "jQuery bxSlider"
}

func (n *JqueryBxSliderSignature) Description() string {
	return "bxSlider is a fully responsive jQuery content slider."
}

func (s *JqueryBxSliderSignature) Check(response *crawler.Response) bool {
	if response.ResourceType != crawler.ResourceTypeScript {
		return false
	}
	if strings.Contains(response.Url, "bxslider") {
		return true
	}
	if strings.Contains(response.Body, "bxSlider") {
		return true
	}
	return false
}

func (s *JqueryBxSliderSignature) Version(response *crawler.Response) string {
	// e.g. bxslider/4.2.12/jquery.bxslider.min.js
	matches := regexp.MustCompile(`bxslider/(\d+\.\d+\.\d+)/`).FindStringSubmatch(response.Url)
	if len(matches) > 1 {
		return matches[1]
	}

	// e.g. * bxSlider v4.2.12
	matches = regexp.MustCompile(`\* bxSlider v(\d+\.\d+\.\d+)`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}

	return ""
}

func (s *JqueryBxSliderSignature) CPE(version string) string {
	return "cpe:/a:bxslider:bxslider:" + version // TODO: verify CPE
}

func (s *JqueryBxSliderSignature) Tags() []string {
	return []string{analyzer.TagLibrary, analyzer.TagJavaScript}
}
