package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestBackboneJsSignatureCheck(t *testing.T) {
	cases := []TestCase{{
		name:     "No body",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "Error message",
		response: &crawler.Response{
			Body: "throw new Error(\"Backbone.history has already been started\");",
		},
		detected: true,
		version:  "",
	}, {
		name: "Error message and has version",
		response: &crawler.Response{
			Body: "throw new Error(\"Backbone.history has already been started\");t.VERSION=\"1.4.1\"",
		},
		detected: true,
		version:  "1.4.1",
	}}

	runTests(t, cases, &BackboneJsSignature)
}
