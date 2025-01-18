package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type KongaSignature struct{}

var _ analyzer.SignatureIf = (*KongaSignature)(nil)

func (n *KongaSignature) Name() string {
	return "Konga"
}

func (n *KongaSignature) Description() string {
	return "An open source tool that enables you to manage your Kong API Gateway with ease."
}

func (s *KongaSignature) Check(response *crawler.Response) bool {
	if strings.Contains(response.Url, "konga") {
		return true
	}
	if strings.Contains(response.Body, "KONGA_CONFIG") {
		return true
	}
	if strings.Contains(response.Body, "konga_version") {
		return true
	}
	if strings.Contains(response.Body, "konga_settings") {
		return true
	}
	return false
}

func (s *KongaSignature) Version(response *crawler.Response) string {
	matches := regexp.MustCompile(`konga_version = "(\d+\.\d+\.\d+)"`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	matches = regexp.MustCompile(`\.js\?r=(\d+\.\d+\.\d+)`).FindStringSubmatch(response.Url)
	if len(matches) > 1 {
		return matches[1]
	}
	return ""
}

func (s *KongaSignature) CPE(version string) string {
	return "cpe:/a:konga_project:konga:" + version // e.g. cpe:/a:konga_project:konga:0.14.1
}

func (s *KongaSignature) Tags() []string {
	return []string{analyzer.TagJavaScript}
}
