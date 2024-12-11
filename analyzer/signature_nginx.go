package analyzer

import (
	"strings"

	"github.com/go-rod/rod/lib/proto"
)

type nginxSignature struct{}

var _ signature = (*nginxSignature)(nil)

func (n *nginxSignature) Name() string {
	return "nginx"
}

func (s *nginxSignature) Check(responses []*proto.NetworkResponseReceived) bool {
	for _, response := range responses {
		server, err := extractServerHeader(response)
		if err != nil {
			continue
		}
		if strings.Contains(server, "nginx") {
			return true
		}
	}
	return false
}

func (n *nginxSignature) Versions(responses []*proto.NetworkResponseReceived) []string {
	versions := []string{}
	for _, response := range responses {
		server, err := extractServerHeader(response)
		if err != nil {
			continue
		}
		if strings.Contains(server, "nginx/") {
			versions = append(versions, strings.TrimPrefix(server, "nginx/"))
		}
	}
	return unique(versions)
}

func (n *nginxSignature) Tags() []Tag {
	return []Tag{TagWebServer, TagReverseProxy}
}
