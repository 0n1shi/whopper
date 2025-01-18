package signature

import "github.com/0n1shi/whopper/analyzer"

// 2. Add the signatures here (sorted alphabetically)
var SignatureIfs = []analyzer.SignatureIf{
	&AmazonCloudFrontSignature{},
	&AmazonS3Signature{},
	&AngularJsSignature{},
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

var Signatures = []*analyzer.Signature{&ApacheSignature}
