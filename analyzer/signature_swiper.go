package analyzer

import (
	"strings"

	"github.com/0n1shi/whopper/crawler"
)

type swiperSignature struct{}

var _ signature = (*swiperSignature)(nil)

func (s *swiperSignature) Name() string {
	return "Swiper"
}

func (s *swiperSignature) Description() string {
	return "Most modern mobile touch slider and framework with hardware accelerated transitions."
}

func (s *swiperSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		for _, line := range strings.Split(response.Body, "\n") {
			if strings.Contains(line, "* Swiper") {
				return true
			}
		}
	}
	return false
}

func (s *swiperSignature) Versions(responses []*crawler.Response) []string {
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

func (s *swiperSignature) Tags() []Tag {
	return []Tag{TagFramework}
}
