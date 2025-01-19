package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestJQueryBxSliderSignature(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		detected bool
		version  string
	}{{
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

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected := Detect(tt.response, &JQueryBxSliderSignature, "example.com")
			version := GetVersion(tt.response, &JQueryBxSliderSignature)
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
