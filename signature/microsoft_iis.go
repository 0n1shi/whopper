package signature

var MicrosoftIisSignature = Signature{
	Name:        "Microsoft IIS",
	Description: "Microsoft Internet Information Services (IIS) is a web server software created by Microsoft for use with the Windows NT family.",
	Cpe:         "cpe:/a:microsoft:iis",

	DetectPattern: DetectPattern{
		Headers: []Header{{
			Name:  "server",
			Value: "Microsoft-IIS",
		}},
	},
	VersionPattern: VersionPattern{
		Headers: []Header{{
			Name:  "server",
			Value: `Microsoft-IIS/(\d+\.\d+)`,
		}},
	},

	OnlySameHost: true,
}
