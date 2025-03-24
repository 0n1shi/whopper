package signature

var ChartJsSignature = Signature{
	Name:        "Chart.js",
	Description: "Simple yet flexible JavaScript charting library for the modern web.",
	Cpe:         "cpe:/a:chartjs:chartjs",

	DetectPattern: DetectPattern{
		URLs: []string{
			"chart.js",
		},
		Bodies: []string{
			"Chart.js",
		},
	},
	VersionPattern: VersionPattern{
		Bodies: []string{
			`Chart\.js v(\d+\.\d+\.\d+)`,
		},
	},
}
