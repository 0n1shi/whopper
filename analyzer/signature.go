package analyzer

import "github.com/go-rod/rod/lib/proto"

type signature interface {
	Name() string
	Check(responses []*proto.NetworkResponseReceived) bool
	Versions(responses []*proto.NetworkResponseReceived) []string
	Tags() []Tag
}
