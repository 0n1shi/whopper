package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestJQueryUISignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "URL (JavaScript)",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Url:          "https://example.com/jquery-ui.js",
		},
		detected: true,
		version:  "",
	}, {
		name: "URL (CSS)",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Url:          "https://example.com/jquery-ui.css",
		},
		detected: true,
		version:  "",
	}, {
		name: "URL with version (JavaScript)",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Url:          "https://example.com/jquery-ui-1.13.2.custom.js",
		},
		detected: true,
		version:  "1.13.2",
	}, {
		name: "URL with version (CSS)",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Url:          "https://example.com/jquery-ui-1.13.2.custom.css",
		},
		detected: true,
		version:  "1.13.2",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Body:         " * jQuery UI CSS Framework 1.13.2",
		},
		detected: true,
		version:  "1.13.2",
	}, {
		name: "Body (no version)",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Body:         " * jQuery UI CSS Framework",
		},
		detected: true,
		version:  "",
	}, {
		name: "Body 2",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Body:         "/*! jQuery UI - v1.13.2",
		},
		detected: true,
		version:  "1.13.2",
	}, {
		name: "Body 2 (no version)",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Body:         "/*! jQuery UI",
		},
		detected: true,
		version:  "",
	}}

	runTests(t, cases, &JQueryUiSignature)
}
