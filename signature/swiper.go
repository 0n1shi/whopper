package signature

import (
	"regexp"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type SwiperSignature struct{}

var _ analyzer.SignatureIf = (*SwiperSignature)(nil)

func (s *SwiperSignature) Name() string {
	return "Swiper"
}

func (s *SwiperSignature) Description() string {
	return "Most modern mobile touch slider and framework with hardware accelerated transitions."
}

// e.g. https://cdn.jsdelivr.net/npm/swiper@8.4.7/swiper-bundle.min.js?ver=0.1.12:2: * Swiper 8.4.7
func (s *SwiperSignature) Check(response *crawler.Response) bool {
	if strings.Contains(response.Url, "npm/swiper@") {
		return true
	}
	return strings.Contains(response.Body, "* Swiper ")
}

func (s *SwiperSignature) Version(response *crawler.Response) string {
	matches := regexp.MustCompile(`npm\/swiper@(\d+\.\d+\.\d+)\/`).FindStringSubmatch(response.Url)
	if len(matches) > 1 {
		return matches[1]
	}
	matches = regexp.MustCompile(`\* Swiper (\d+\.\d+\.\d+)`).FindStringSubmatch(response.Body)
	if len(matches) > 1 {
		return matches[1]
	}
	return ""
}

func (s *SwiperSignature) CPE(version string) string {
	return "cpe:/a:swiperjs:swiper:" + version
}

func (s *SwiperSignature) Tags() []string {
	return []string{analyzer.TagFramework}
}
