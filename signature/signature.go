package signature

import "github.com/0n1shi/whopper/analyzer"

// 2. Add the signatures here (sorted alphabetically)
var SignatureIfs = []analyzer.SignatureIf{
	&ClaritySignature{},
	&CorejsSignature{},
	&JquerySignature{},
	&JqueryBxSliderSignature{},
	&JqueryCookieSignature{},
	&JqueryUiSignature{},
	&KongaSignature{},
	&LodashSignature{},
	&ModPerlSignature{},
	&MomentJsSignature{},
	&NginxSignature{},
	&OpenSSLSignature{},
	&PerlSignature{},
	&PhpSignature{},
	&StyledComponentsSignature{},
	&SwiperSignature{},
	&UnderscoreSignature{},
	&UnpkgSignature{},
	&WebVitalsSignature{},
	&WordpressPluginPageNaviSignature{},
	&WordpressPluginYoastSEOSignature{},
}
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
}
