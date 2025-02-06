package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestUnpkgSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No headers",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "URL contains unpkg.com",
		response: &crawler.Response{
			Url: SameHostUrl,
			Body: `<html>
	<head>
		<title>test</title>
	</head>
	<body>
		<a href="https://unpkg.com/">test</a>
	</body>
</html>`,
		},
		detected: true,
		version:  "",
	}}

	runTests(t, cases, &UnpkgSignature)
}
