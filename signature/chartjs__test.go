package signature

import (
	"testing"

	"github.com/0n1shi/whopper/crawler"
)

func TestChartJsSignature(t *testing.T) {
	cases := []TestCase{{
		name:     "No body and no url",
		response: &crawler.Response{},
		detected: false,
		version:  "",
	}, {
		name: "Url",
		response: &crawler.Response{
			ResourceType: crawler.ResourceTypeScript,
			URL:          "http://x.x.x.x/bower_components/chart.js/dist/Chart.js?r=0.14.9",
		},
		detected: true,
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
		detected: true,
		version:  "2.9.3",
	}}

	runTests(t, cases, &ChartJsSignature)
}
