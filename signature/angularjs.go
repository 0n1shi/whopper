package signature

var AngularJsSignature = Signature{
	Name:        "AngularJS",
	Description: "A discontinued free and open-source JavaScript-based web framework for developing single-page applications.",
	Cpe:         "cpa:/a:angularjs:angular.js",

	DetectPattern: DetectPattern{
		Bodies: []string{
			`angular`,
		},
		URLs: []string{
			`/angular-`,
		},
	},
	VersionPattern: VersionPattern{
		Bodies: []string{
			`\* @license AngularJS v(\d+\.\d+\.\d+)`,
			`http:\/\/errors.angularjs.org\/(\d+\.\d+\.\d+(-rc\.\d+)?)`,
		},
	},
}
