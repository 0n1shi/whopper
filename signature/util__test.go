package signature

import (
	"regexp"
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestDetect(t *testing.T) {
	tests := []struct {
		name       string
		response   *crawler.Response
		signature  *Signature
		targetHost string
		expected   bool
	}{{
		name: "body match",
		response: &crawler.Response{
			Body: "jQuery",
		},
		signature: &Signature{
			DetectPattern: DetectPattern{
				Bodies: []string{"jQuery"},
			},
		},
		expected: true,
	}, {
		name: "url match",
		response: &crawler.Response{
			URL: "https://example.com/jquery/3.5.1/jquery.min.js",
		},
		signature: &Signature{
			DetectPattern: DetectPattern{
				URLs: []string{"jquery.min.js"},
			},
		},
		expected: true,
	}, {
		name: "header match",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "X-Powered-By",
				Value: "PHP/7.4.3",
			}},
		},
		signature: &Signature{
			DetectPattern: DetectPattern{
				Headers: []Header{{
					Name:  "X-Powered-By",
					Value: "PHP",
				}},
			},
		},
		expected: true,
	}, {
		name: "header match with empty value",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "x-cache",
				Value: "",
			}},
		},
		signature: &Signature{
			DetectPattern: DetectPattern{
				Headers: []Header{{
					Name: "x-cache",
				}},
			},
		},
		expected: true,
	}, {
		name: "cookie match",
		response: &crawler.Response{
			Cookies: []*crawler.Cookie{{
				Name:  "session",
				Value: "1234567890abcdef",
			}},
		},
		signature: &Signature{
			DetectPattern: DetectPattern{
				Cookies: []Cookie{{
					Name:  "session",
					Value: "1234567890abcdef",
				}},
			},
		},
		expected: true,
	}, {
		name: "cookie match with empty value",
		response: &crawler.Response{
			Cookies: []*crawler.Cookie{{
				Name:  "AWSALB",
				Value: "1234567890abcdef",
			}},
		},
		signature: &Signature{
			DetectPattern: DetectPattern{
				Cookies: []Cookie{{
					Name: "AWSALB",
				}},
			},
		},
		expected: true,
	}, {
		name: "url match but different host",
		response: &crawler.Response{
			URL: "https://example.com/jquery/3.5.1/jquery.min.js",
		},
		signature: &Signature{
			DetectPattern: DetectPattern{
				URLs: []string{"jquery.min.js"},
			},
			OnlySameHost: true,
		},
		targetHost: "example.org",
		expected:   false,
	}}

	for _, test := range tests {
		actual := Detect(test.response, test.signature)
		if actual != test.expected {
			t.Errorf("Detect(%v, %v, %v) = %v; expected %v", test.response, test.signature, test.targetHost, actual, test.expected)
		}
	}
}

func TestGetVersion(t *testing.T) {
	tests := []struct {
		name      string
		response  *crawler.Response
		signature *Signature
		expected  string
	}{{
		name: "body match",
		response: &crawler.Response{
			Body: "jQuery v3.5.1",
		},
		signature: &Signature{
			VersionPattern: VersionPattern{
				Bodies: []string{`jQuery v(\d+\.\d+\.\d+)`},
			},
		},
		expected: "3.5.1",
	}, {
		name: "url match",
		response: &crawler.Response{
			URL: "https://example.com/jquery/3.5.1/jquery.min.js",
		},
		signature: &Signature{
			VersionPattern: VersionPattern{
				URLs: []string{`jquery/(\d+\.\d+\.\d+)/jquery.min.js`},
			},
		},
		expected: "3.5.1",
	}, {
		name: "header match",
		response: &crawler.Response{
			Headers: []*crawler.Header{{
				Name:  "X-Powered-By",
				Value: "PHP/7.4.3",
			}},
		},
		signature: &Signature{
			VersionPattern: VersionPattern{
				Headers: []Header{{
					Name:  "X-Powered-By",
					Value: `PHP/(\d+\.\d+\.\d+)`,
				}},
			},
		},
		expected: "7.4.3",
	}, {
		name: "cookie match",
		response: &crawler.Response{
			Cookies: []*crawler.Cookie{{
				Name:  "session",
				Value: "version=3.5.1",
			}},
		},
		signature: &Signature{
			VersionPattern: VersionPattern{
				Cookies: []Cookie{{
					Name:  "session",
					Value: `version=(\d+\.\d+\.\d+)`,
				}},
			},
		},
		expected: "3.5.1",
	}, {
		name: "version function",
		response: &crawler.Response{
			Body: "major:3,minor:5,patch:1",
		},
		signature: &Signature{
			VersionFuncs: []VersionFunc{
				func(res *crawler.Response) string {
					matches := regexp.MustCompile(`major:(\d+),minor:(\d+),patch:(\d+)`).FindStringSubmatch(res.Body)
					if len(matches) > 3 {
						return matches[1] + "." + matches[2] + "." + matches[3]
					}
					return ""
				},
			},
		},
		expected: "3.5.1",
	}}

	for _, test := range tests {
		actual := GetVersion(test.response, test.signature)
		if actual != test.expected {
			t.Errorf("GetVersion(%v, %v) = %v; expected %v", test.response, test.signature, actual, test.expected)
		}
	}
}
