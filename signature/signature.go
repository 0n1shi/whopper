package signature

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
	Urls    []string
	Headers []Header
	Cookies []Cookie
}

type VersionPattern struct {
	Bodies  []string
	Urls    []string
	Headers []Header
	Cookies []Cookie
}

type Signature struct {
	Name        string
	Description string
	Cpe         string

	DetectPattern  DetectPattern
	VersionPattern VersionPattern

	OnlySameHost bool
}

var Signatures = []*Signature{
	&AmazonCloudFrontSignature,
	&AmazonS3Signature,
	&AngularJsSignature,
	&ApacheSignature,
	&AwsAlbSignature,
	&BackboneJsSignature,
	&BootstrapSignature,
	&ChartJsSignature,
	&ClaritySignature,
	&CoreJsSignature,
	&JQuerySignature,
	&JQueryBxSliderSignature,
	&JQueryCookieSignature,
	&JQueryMigrateSignature,
	&JQueryUiSignature,
	&KongaSignature,
	&LodashSignature,
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
	&WebVitalsSignature,
	&WordpressSignature,
	&WordpressPluginAllInOneSEOSignature,
	&WordpressPluginContactForm7Signature,
	&WordpressPluginPageNaviSignature,
	&WordpressPluginYoastSEOSignature,
}
