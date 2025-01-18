package signature

import (
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type UnpkgSignature struct{}

var _ analyzer.SignatureIf = (*UnpkgSignature)(nil)

func (n *UnpkgSignature) Name() string {
	return "UNPKG"
}

func (n *UnpkgSignature) Description() string {
	return "unpkg is a fast, global content delivery network for everything on npm."
}

func (s *UnpkgSignature) Check(response *crawler.Response) bool {
	return strings.Contains(response.Url, "unpkg.com")
}

func (s *UnpkgSignature) Version(response *crawler.Response) string {
	return ""
}

func (s *UnpkgSignature) CPE(version string) string {
	return ""
}

func (s *UnpkgSignature) Tags() []string {
	return []string{analyzer.TagCDN}
}
