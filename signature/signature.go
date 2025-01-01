package signature

import "github.com/0n1shi/whopper/analyzer"

// 2. Add the signatures here
var Signatures = []analyzer.Signature{
	&NginxSignature{},
	&ApacheSignature{},
	&PhpSignature{},
	&SwiperSignature{},
	&JquerySignature{},
	&JqueryCookieSignature{},
	&JqueryUiSignature{},
	&ClaritySignature{},
	&WordpressPluginYoastSEOSignature{},
	&AwsAlbSignature{},
	&CorejsSignature{},
	&BackboneJsSignature{},
	&OpenSSLSignature{},
	&StyledComponentsSignature{},
	&AmazonS3Signature{},
	&AmazonCloudFrontSignature{},
	&UnpkgSignature{},
	&WordpressPluginPageNaviSignature{},
	&PerlSignature{},
	&ModPerlSignature{},
}
