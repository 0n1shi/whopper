package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestBootstrapSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No headers",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "URL with version",
		response: &crawler.Response{
			Url: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
		},
		detected: true,
		version:  "3.3.7",
	}, {
		name: "Body with version",
		response: &crawler.Response{
			Body: "* Bootstrap v4.6.0",
		},
		detected: true,
		version:  "4.6.0",
	}}

	runTests(t, cases, &BootstrapSignature)
}
