package signature

var WordpressPluginContactForm7Signature = Signature{
	Name:        "WordPress Plugin - Contact Form 7",
	Description: "Contact Form 7 can manage multiple contact forms, plus you can customize the form and the mail contents flexibly with simple markup. The form supports Ajax-powered submitting, CAPTCHA, Akismet spam filtering and so on.",
	Cpe:         "cpe:/a:takayukister:contact_form_7",

	DetectPattern: DetectPattern{
		URLs: []string{
			`/wp-content/plugins/contact-form-7/`,
		},
	},
	VersionPattern: VersionPattern{
		URLs: []string{
			`/wp-content/plugins/contact-form-7/.+\?ver=(\d+\.\d+\.\d+)`,
		},
	},
}
