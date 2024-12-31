package signature

import (
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type AmazonCloudFrontSignature struct{}

var _ analyzer.Signature = (*AmazonCloudFrontSignature)(nil)

func (n *AmazonCloudFrontSignature) Name() string {
	return "Amazon CloudFront"
}

func (n *AmazonCloudFrontSignature) Description() string {
	return "Amazon CloudFront is a fast content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally with low latency, high transfer speeds, all within a developer-friendly environment."
}

func (s *AmazonCloudFrontSignature) Check(response *crawler.Response) bool {
	for _, header := range response.Headers {
		if header.Name == "via" && strings.Contains(header.Value, ".cloudfront.net (CloudFront)") {
			return true
		}
		if header.Name == "x-cache" && strings.Contains(header.Value, "from cloudfront") {
			return true
		}
	}
	return false
}

func (s *AmazonCloudFrontSignature) Version(response *crawler.Response) string {
	return ""
}

func (s *AmazonCloudFrontSignature) CPE(version string) string {
	return ""
}

func (s *AmazonCloudFrontSignature) Tags() []string {
	return []string{analyzer.TagAWS, analyzer.TagCDN}
}
