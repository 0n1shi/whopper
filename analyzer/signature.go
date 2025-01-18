package analyzer

import (
	"github.com/0n1shi/whopper/crawler"
)

// 1. Implement the signature interface
type SignatureIf interface {
	Name() string
	Description() string
	Check(response *crawler.Response) bool
	Version(response *crawler.Response) string
	CPE(version string) string
	Tags() []string
}
