package signature

import (
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type SwiperSignature struct{}

var _ analyzer.Signature = (*SwiperSignature)(nil)

func (s *SwiperSignature) Name() string {
	return "Swiper"
}

func (s *SwiperSignature) Description() string {
	return "Most modern mobile touch slider and framework with hardware accelerated transitions."
}

func (s *SwiperSignature) Check(response *crawler.Response) bool {
	for _, line := range strings.Split(response.Body, "\n") {
		if strings.Contains(line, "* Swiper") {
			return true
		}
	}
	return false
}

func (s *SwiperSignature) Version(response *crawler.Response) string {
	for _, line := range strings.Split(response.Body, "\n") {
		if strings.Contains(line, "* Swiper") {
			version := strings.Split(line, "Swiper")[1]
			version = strings.TrimSpace(version)
			return version
		}
	}
	return ""
}

func (s *SwiperSignature) Tags() []string {
	return []string{analyzer.TagFramework}
}
