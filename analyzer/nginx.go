package analyzer

import (
	"strings"

	"github.com/go-rod/rod/lib/proto"
)

type NginxSignature struct{}

var _ Signature = (*NginxSignature)(nil)

func (n *NginxSignature) Name() string {
	return "nginx"
}

func (s *NginxSignature) Check(responses []*proto.NetworkResponseReceived) bool {
	for _, response := range responses {
		headers := response.Response.Headers
		if val, ok := headers["Server"]; ok {
			server := ""
			if val.Unmarshal(&server) == nil {
				if strings.Contains(server, "nginx") {
					return true
				}
			}
		}
	}
	return false
}

func (n *NginxSignature) Versions(responses []*proto.NetworkResponseReceived) []string {
	versions := []string{}
	for _, response := range responses {
		headers := response.Response.Headers
		if val, ok := headers["Server"]; ok {
			server := ""
			if val.Unmarshal(&server) == nil {
				if strings.Contains(server, "nginx") {
					versions = append(versions, server)
				}
			}
		}
	}
	return versions
}

func (n *NginxSignature) Tags() []Tag {
	return []Tag{TagWebServer, TagReverseProxy}
}
