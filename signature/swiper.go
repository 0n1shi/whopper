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

func (s *SwiperSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		for _, line := range strings.Split(response.Body, "\n") {
			if strings.Contains(line, "* Swiper") {
				return true
			}
		}
	}
	return false
}

func (s *SwiperSignature) Versions(responses []*crawler.Response) []string {
	versions := []string{}
	for _, response := range responses {
		for _, line := range strings.Split(response.Body, "\n") {
			if strings.Contains(line, "* Swiper") {
				version := strings.Split(line, "Swiper")[1]
				versions = append(versions, strings.TrimSpace(version))
			}
		}
	}
	return unique(versions)
}

func (s *SwiperSignature) Tags() []string {
	return []string{analyzer.TagFramework}
}
