package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestStyledComponentsSignature(t *testing.T) {
	cases := []TestCase{{
		name: "No body and no url",
		response: &crawler.Response{
			Url:          "",
			ResourceType: crawler.ResourceTypeScript,
		},
		detected: false,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         "R=\"style[\"+w+'][data-styled-version=\"5.3.11\"]'",
		},
		detected: true,
		version:  "5.3.11",
	}, {
		name: "Body 2",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         ",r.setAttribute(\"data-styled-version\",\"5.3.11\");",
		},
		detected: true,
		version:  "5.3.11",
	}, {
		name: "Body 3",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         "\"+[n&&'nonce=\"'+n+'\"',w+'=\"true\"','data-styled-version=\"5.3.11\"']",
		},
		detected: true,
		version:  "5.3.11",
	}, {
		name: "Body 4",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         "var n=((t={})[w]=\"\",t[\"data-styled-version\"]=\"5.3.11\",",
		},
		detected: true,
		version:  "5.3.11",
	}, {
		name: "Body 5",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeDocument,
			Body:         "<style data-styled=\"true\" data-styled-version=\"5.3.11\">",
		},
		detected: true,
		version:  "5.3.11",
	}}

	runTests(t, cases, &StyledComponentsSignature)
}
