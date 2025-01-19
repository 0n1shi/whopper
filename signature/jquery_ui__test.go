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
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Body:         " * jQuery UI CSS Framework 1.13.2",
		},
		detected: true,
		version:  "1.13.2",
	}, {
		name: "Body 2",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeStylesheet,
			Body:         " * jQuery UI CSS Framework",
		},
		detected: true,
		version:  "",
	}}

	runTests(t, cases, &JQueryUiSignature)
}
