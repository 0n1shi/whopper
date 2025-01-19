package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestJQueryBxSliderSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "URL",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "https://cdn.jsdelivr.net/bxslider/4.2.12/jquery.bxslider.min.js",
		},
		detected: true,
		version:  "4.2.12",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body: `/**
 * bxSlider v4.2.12
 * Copyright 2013-2015 Steven Wanderski
 * Written while drinking Belgian ales and listening to jazz
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */
!function(t){var e=
`,
		},
		detected: true,
		version:  "4.2.12",
	}} // TODO: Add a test for script tag with src attribute

	runTests(t, cases, &JQueryBxSliderSignature)
}
