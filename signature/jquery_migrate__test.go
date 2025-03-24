package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestJQueryMigrateSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "URL",
		response: &crawler.Response{
			URL: "https://example.com/jquery-migrate.min.js?ver=3.3.3",
		},
		detected: true,
		version:  "3.3.3",
	}, {
		name: "Body",
		response: &crawler.Response{
			Body:         " * jQuery Migrate v3.3.3",
		},
		detected: true,
		version:  "3.3.3",
	}}

	runTests(t, cases, &JQueryMigrateSignature)
}
