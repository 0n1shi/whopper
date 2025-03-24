package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestDojoToolkitSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "URL",
		response: &crawler.Response{
			URL: "http://example.com/dojo/dojo.js",
		},
		detected: true,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			Body: "dojo.version={major:1,minor:6,patch:1,",
		},
		detected: true,
		version:  "1.6.1",
	}}

	runTests(t, cases, &DojoToolkitSignature)
}
