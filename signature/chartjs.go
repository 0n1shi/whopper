package signature

import (
	"github.com/0n1shi/whopper/analyzer"
)

var ChartJsSignature = analyzer.Signature{
	Name:        "Chart.js",
	Description: "Simple yet flexible JavaScript charting library for the modern web.",
	Cpe:         "cpe:/a:chartjs:chartjs",

	UrlRegexps: []string{
		"chart.js",
	},
	BodyRegexps: []string{
		"Chart.js",
		`Chart\.js v?(\d+\.\d+\.\d+)?`,
	},
}
