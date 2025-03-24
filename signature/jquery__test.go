package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestJQuerySignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "URL",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			URL:          "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery",
		},
		detected: true,
		version:  "3.6.0",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         "/*! jQuery v3.6.0 | (c) OpenJS Foundation and other contributors | jquery.org/license */",
		},
		detected: true,
		version:  "3.6.0",
	}}

	runTests(t, cases, &JQuerySignature)
}
