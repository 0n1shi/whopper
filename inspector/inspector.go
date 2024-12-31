package inspector

import (
	"github.com/0n1shi/whopper/crawler"
)


type Inspector interface {
	Inspect(responses []*crawler.Response)
}
