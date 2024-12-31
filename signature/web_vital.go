package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type WebVitalsSignature struct{}

var _ analyzer.Signature = (*WebVitalsSignature)(nil)

func (s *WebVitalsSignature) Name() string {
	return "Web Vitals"
}

func (s *WebVitalsSignature) Description() string {
	return "Web Vitals are quality signals key to delivering great UX on the web (https://web.dev/vitals)."
}

func (s *WebVitalsSignature) Check(response *crawler.Response) bool {
	return strings.Contains(response.Url, "/web-vitals@")
}

func (s *WebVitalsSignature) Version(response *crawler.Response) string {
	matches := regexp.MustCompile(`/web-vitals@v?(\d+\.\d+\.\d+)`).FindStringSubmatch(response.Url)
	if len(matches) > 1 {
		return matches[1]
	}
	return ""
}

func (s *WebVitalsSignature) CPE(version string) string {
	return "cpe:/a:magazine3:core_web_vitals:" + version
}

func (s *WebVitalsSignature) Tags() []string {
	return []string{analyzer.TagWebServer, analyzer.TagReverseProxy}
}
