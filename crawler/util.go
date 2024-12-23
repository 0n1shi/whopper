package crawler

import (
	"fmt"
	"log/slog"
)

const responseDumpLimit = 300

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
