package inspector

import (
	"github.com/0n1shi/whopper/crawler"
)

const (
	maxURLLengthToShow         = 57
	maxBodyLengthToShow        = 97
	maxCookieValueLengthToShow = 57
	maxHeaderValueLengthToShow = 57
)

type Inspector interface {
	Inspect(responses []*crawler.Response)
}
