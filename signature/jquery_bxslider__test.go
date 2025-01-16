package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestJQueryBxSliderSignature(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		expected bool
		version  string
	}{{
		name:     "No body and no url",
		response: &crawler.Response{},
		expected: false,
		version:  "",
	}, {
		name: "URL",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url: "https://cdn.jsdelivr.net/bxslider/4.2.12/jquery.bxslider.min.js",
		},
		expected: true,
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
		expected: true,
		version:  "4.2.12",
	}} // TODO: Add a test for script tag with src attribute

	for _, tt := range tests {
		s := &JqueryBxSliderSignature{}
		t.Run(tt.name, func(t *testing.T) {
			if got := s.Check(tt.response); got != tt.expected {
				t.Errorf("Check() = %v, want %v", got, tt.expected)
			}
			if got := s.Version(tt.response); got != tt.version {
				t.Errorf("Version() = %v, want %v", got, tt.version)
			}
		})
	}
}
