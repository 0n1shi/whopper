package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestUnpkgSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No headers",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "URL contains unpkg.com",
		response: &crawler.Response{
			Url: "https://unpkg.com/web-vitals@2.1.4/dist/web-vitals.iife.js",
		},
		detected: true,
		version:  "",
	}}

	runTests(t, cases, &UnpkgSignature)
}
