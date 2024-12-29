package signature

import (
	"strings"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type AwsAlbSignature struct{}

var _ analyzer.Signature = (*AwsAlbSignature)(nil)

func (n *AwsAlbSignature) Name() string {
	return "AWS ALB (Application Load Balancer)"
}

func (n *AwsAlbSignature) Description() string {
	return "Load balance HTTP and HTTPS traffic with advanced request routing targeted at the delivery of modern applications."
}

func (s *AwsAlbSignature) Check(response *crawler.Response) bool {
	for _, cookie := range response.Cookies {
		if strings.Contains(cookie.Name, "AWSALB") {
			return true
		}
		if strings.Contains(cookie.Name, "AWSALB") {
			return true
		}
	}
	return false
}

func (s *AwsAlbSignature) Version(response *crawler.Response) string {
	return "" // TODO: No version information available ?
}

func (s *AwsAlbSignature) CPE(version string) string {
	return ""
}

func (s *AwsAlbSignature) Tags() []string {
	return []string{analyzer.TagAWS, analyzer.TagLoadBalancer}
}
