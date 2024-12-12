package analyzer

import (
	"strings"

	"github.com/go-rod/rod/lib/proto"
)

type phpSignature struct{}

var _ signature = (*phpSignature)(nil)

func (n *phpSignature) Name() string {
	return "php"
}

func (s *phpSignature) Check(responses []*proto.NetworkResponseReceived) bool {
	for _, response := range responses {
		server, err := extractServerHeader(response)
		if err != nil {
			continue
		}
		if strings.Contains(server, "php") {
			return true
		}
	}
	return false
}

func (n *phpSignature) Versions(responses []*proto.NetworkResponseReceived) []string {
	versions := []string{}
	for _, response := range responses {
		server, err := extractServerHeader(response)
		if err != nil {
			continue
		}
		if strings.Contains(server, "php/") {
			versions = append(versions, strings.TrimPrefix(server, "php/"))
		}
	}
	return unique(versions)
}

func (n *phpSignature) Tags() []Tag {
	return []Tag{TagProgrammingLanguage}
}
