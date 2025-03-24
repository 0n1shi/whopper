package signature

import "github.com/0n1shi/whopper/crawler"

type Header struct {
	Name  string
	Value string
}

type Cookie struct {
	Name  string
	Value string
}

type DetectPattern struct {
	Bodies  []string
	URLs    []string
	Headers []Header
	Cookies []Cookie
}

type VersionPattern struct {
	Bodies  []string
	URLs    []string
	Headers []Header
	Cookies []Cookie
}

type VersionFunc func(res *crawler.Response) string

type Signature struct {
	Name        string
	Description string
	Cpe         string

	DetectPattern  DetectPattern
	VersionPattern VersionPattern

	VersionFuncs []VersionFunc

	OnlySameHost bool
}

var Signatures = []*Signature{
	&AmazonCloudFrontSignature,
	&AmazonS3Signature,
	&AngularJsSignature,
	&ApacheSignature,
	&AspDotNetSignature,
	&AwsElbSignature,
	&BackboneJsSignature,
	&BootstrapSignature,
	&ChartJsSignature,
	&ClaritySignature,
	&CoreJsSignature,
	&DojoToolkitSignature,
	&JQuerySignature,
	&JQueryBxSliderSignature,
	&JQueryCookieSignature,
	&JQueryMigrateSignature,
	&JQueryUiSignature,
	&KongaSignature,
	&LodashSignature,
	&MicrosoftIisSignature,
	&ModPerlSignature,
	&MomentJsSignature,
	&NginxSignature,
	&OpenSSLSignature,
	&PerlSignature,
	&PhpSignature,
	&StyledComponentsSignature,
	&SwiperSignature,
	&UnderscoreSignature,
	&UnpkgSignature,
	&VueJsSignature,
	&WebVitalsSignature,
	&WordpressSignature,
	&WordpressPluginAllInOneSEOSignature,
	&WordpressPluginContactForm7Signature,
	&WordpressPluginPageNaviSignature,
	&WordpressPluginYoastSEOSignature,
}
