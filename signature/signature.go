package signature

import "github.com/0n1shi/whopper/analyzer"

// 2. Add the signatures here (sorted alphabetically)
var Signatures = []analyzer.Signature{
	&AmazonCloudFrontSignature{},
	&AmazonS3Signature{},
	&AngularJsSignature{},
	&ApacheSignature{},
	&AwsAlbSignature{},
	&BackboneJsSignature{},
	&BootstrapSignature{},
	&ChartJsSignature{},
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
