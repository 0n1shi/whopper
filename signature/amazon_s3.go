package signature

import (
	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type AmazonS3Signature struct{}

var _ analyzer.SignatureIf = (*AmazonS3Signature)(nil)

func (n *AmazonS3Signature) Name() string {
	return "Amazon S3"
}

func (n *AmazonS3Signature) Description() string {
	return "Cloud Object Storage — Experience Reliability & Scalability With AWS Online Storage Solutions."
}

func (s *AmazonS3Signature) Check(response *crawler.Response) bool {
	for _, header := range response.Headers {
		if header.Name == "server" && header.Value == "AmazonS3" {
			return true
		}
	}
	return false
}

func (s *AmazonS3Signature) Version(response *crawler.Response) string {
	return ""
}

func (s *AmazonS3Signature) CPE(version string) string {
	return ""
}

func (s *AmazonS3Signature) Tags() []string {
	return []string{analyzer.TagWebServer, analyzer.TagAWS, analyzer.TagCDN}
}
