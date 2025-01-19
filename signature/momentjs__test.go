package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestMomentJsSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "URL",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "http://x.x.x.x/bower_components/moment/moment.js",
		},
		detected: true,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "http://x.x.x.x/bower_components/moment/moment.js",
			Body: `//! moment.js
//! version : 2.9.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com`,
		},
		detected: true,
		version:  "2.9.0",
	}}

	runTests(t, cases, &MomentJsSignature)
}
