package signature

import (
	"testing"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

func TestAngularJSSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		detected bool
		version  string
	}{{
		name:     "No headers",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "URL",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "http://x.x.x.x/bower_components/angular-sanitize/angular-sanitize.js?r=0.14.9",
		},
		detected: true,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "http://x.x.x.x/bower_components/angular-sanitize/angular-sanitize.js?r=0.14.9",
			Body:         " * @license AngularJS v1.5.11",
		},
		detected: true,
		version:  "1.5.11",
	}, {
		name: "Body 2",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body:         `http://errors.angularjs.org/1.3.0-rc.4/"+(e?e+"/":"")+i,r=2;`,
		},
		detected: true,
		version:  "1.3.0-rc.4",
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			detected, version := analyzer.Analyze(tt.response, &AngularJsSignature, "example.com")
			if detected != tt.detected {
				t.Errorf("detected = %v, want %v", detected, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
