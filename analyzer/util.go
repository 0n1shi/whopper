package analyzer

import (
	"fmt"

	"github.com/go-rod/rod/lib/proto"
)

func unique(list []string) []string {
	seen := map[string]struct{}{}
	uniq := []string{}
	for _, s := range list {
		if _, ok := seen[s]; ok {
			continue
		}
		seen[s] = struct{}{}
		uniq = append(uniq, s)
	}
	return uniq
}

func extractHeader(response *proto.NetworkResponseReceived, name string) (string, error) {
	if val, ok := response.Response.Headers[name]; ok {
		header := ""
		if val.Unmarshal(&header) == nil {
			return header, nil
		}
	}
	return "", fmt.Errorf("header %s not found", name)
}

func extractServerHeader(response *proto.NetworkResponseReceived) (string, error) {
	return extractHeader(response, "Server")
}
