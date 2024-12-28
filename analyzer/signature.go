package analyzer

import (
	"github.com/0n1shi/whopper/crawler"
)

// 1. Implement the signature interface
type Signature interface {
	Name() string
	Description() string
	Check(responses []*crawler.Response) bool
	Versions(responses []*crawler.Response) []string
	Tags() []string
}
