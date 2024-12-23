package analyzer

import (
	"strings"

	"github.com/0n1shi/whopper/crawler"
)

type awsAlbSignature struct{}

var _ signature = (*awsAlbSignature)(nil)

func (n *awsAlbSignature) Name() string {
	return "AWS ALB (Application Load Balancer)"
}

func (n *awsAlbSignature) Description() string {
	return "Load balance HTTP and HTTPS traffic with advanced request routing targeted at the delivery of modern applications."
}

func (s *awsAlbSignature) Check(responses []*crawler.Response) bool {
	for _, response := range responses {
		for _, cookie := range response.Cookies {
			if strings.Contains(cookie.Name, "AWSALB") {
				return true
			}
			if strings.Contains(cookie.Name, "AWSALB") {
				return true
			}
		}
	}
	return false
}

func (s *awsAlbSignature) Versions(responses []*crawler.Response) []string {
	return []string{} // TODO: No version information available ?
}

func (s *awsAlbSignature) Tags() []string {
	return []string{TagAWS, TagLoadBalancer}
}
