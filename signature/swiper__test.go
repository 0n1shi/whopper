package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestSwiperSignature(t *testing.T) {
	cases := []TestCase{{
		name: "No body and no url",
		response: &crawler.Response{
			Url: "",
		},
		detected: false,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			Url: "https://cdn.jsdelivr.net/npm/swiper@8.4.7/swiper-bundle.min.js?ver=0.1.12",
		},
		detected: true,
		version:  "8.4.7",
	}, {
		name: "Body 2",
		response: &crawler.Response{
			Body: "* Swiper 8.4.7",
		},
		detected: true,
		version:  "8.4.7",
	}}

	runTests(t, cases, &SwiperSignature)
}
