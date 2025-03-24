package signature

var WebVitalsSignature = Signature{
	Name:        "Web Vitals",
	Description: "Web Vitals are quality signals key to delivering great UX on the web (https://web.dev/vitals).",
	Cpe:         "cpe:/a:magazine3:core_web_vitals:",

	DetectPattern: DetectPattern{
		URLs: []string{
			"/web-vitals@",
		},
	},
	VersionPattern: VersionPattern{
		URLs: []string{
			`/web-vitals@v?(\d+\.\d+\.\d+)`,
		},
	},
}
