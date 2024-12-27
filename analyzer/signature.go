package analyzer

import (
	"github.com/0n1shi/whopper/crawler"
)

// 1. Implement the signature interface
type signature interface {
	Name() string
	Description() string
	Check(responses []*crawler.Response) bool
	Versions(responses []*crawler.Response) []string
	Tags() []string
}

// 2. Add the signatures here
var signatures = []signature{
	&nginxSignature{},
	&apacheSignature{},
	&phpSignature{},
	&swiperSignature{},
	&jquerySignature{},
	&jqueryCookieSignature{},
	&jqueryUiSignature{},
	&claritySignature{},
	&wordpressPluginYoastSEOSignature{},
	&awsAlbSignature{},
	&corejsSignature{},
	&signatureBackboneJs{},
}
