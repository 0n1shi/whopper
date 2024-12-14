package crawler

import (
	"fmt"
	"log/slog"

	"github.com/go-rod/rod/lib/proto"
)

const responseDumpLimit = 300

func headerToMap(headers proto.NetworkHeaders) map[string]string {
	headerMap := make(map[string]string)
	for key, val := range headers {
		str := ""
		if err := val.Unmarshal(&str); err != nil {
			slog.Warn("failed to unmarshal header", "header", key, "value", val, "error", err)
			continue
		}
		headerMap[key] = str
	}
	return headerMap
}

func DumpResponse(response *Response) {
	slog.Debug("response", "url", response.Url)
	fmt.Printf("%s %d %s\n", response.Protocol, response.Status, response.StatusText)
	for key, val := range response.Headers {
		fmt.Printf("%s: %s\n", key, val)
	}
	fmt.Println()
	if response.ResourceType == ResourceTypeDocument || response.ResourceType == ResourceTypeScript || response.ResourceType == ResourceTypeStylesheet {
		if len(response.Body) > responseDumpLimit {
			fmt.Println(response.Body[:responseDumpLimit], "...")
		} else {
			fmt.Println(response.Body)
		}
		fmt.Println()
	}
}
