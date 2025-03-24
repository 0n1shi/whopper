package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

var SameHostURL = "http://example.com"
var OtherHostURL = "http://other.com"

var SameHost = "example.com"

type TestCase struct {
	name     string
	response *crawler.Response
	detected bool
	version  string
}

func runTests(test *testing.T, cases []TestCase, signature *Signature) {
	for _, c := range cases {
		test.Run(c.name, func(t *testing.T) {
			detected := Detect(c.response, signature, SameHost)
			version := ""
			if detected {
				version = GetVersion(c.response, signature)
			}

			if detected != c.detected {
				t.Errorf("detected = %v, want %v", detected, c.detected)
			}
			if version != c.version {
				t.Errorf("version = %v, want %v", version, c.version)
			}
		})
	}
}
