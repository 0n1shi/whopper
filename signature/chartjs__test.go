package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestChartJsSignatureCheck(t *testing.T) {
	tests := []struct {
		name     string
		response *crawler.Response
		expected bool
		version  string
	}{{
		name:     "No body and no url",
		response: &crawler.Response{},
		expected: false,
		version:  "",
	}, {
		name: "Url",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Url:          "http://x.x.x.x/bower_components/chart.js/dist/Chart.js?r=0.14.9",
		},
		expected: true,
		version:  "",
	}, {
		name: "Body",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			Body: `/*!
 * Chart.js v2.9.3
 * https://www.chartjs.org
 * (c) 2019 Chart.js Contributors
 * Released under the MIT License
 */`,
		},
		expected: true,
		version:  "2.9.3",
	}}

	for _, tt := range tests {
		s := &ChartJsSignature{}
		t.Run(tt.name, func(t *testing.T) {
			if got := s.Check(tt.response); got != tt.expected {
				t.Errorf("Check() = %v, want %v", got, tt.expected)
			}
			if got := s.Version(tt.response); got != tt.version {
				t.Errorf("Version() = %v, want %v", got, tt.version)
			}
		})
	}
}
