package signature

import (
	"testing"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

func TestBackboneJsSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		detected bool
		version  string
	}{{
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

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			deleted, version := analyzer.Analyze(tt.response, &BackboneJsSignature, "example.com")
			if deleted != tt.detected {
				t.Errorf("deleted = %v, want %v", deleted, tt.detected)
			}
			if version != tt.version {
				t.Errorf("version = %v, want %v", version, tt.version)
			}
		})
	}
}
