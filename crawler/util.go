package crawler

import (
	"fmt"
	"log/slog"
)

const responseDumpLimit = 300

func DumpResponse(response *Response) {
	slog.Debug("response", "url", response.Url)
	fmt.Printf("%s %d %s\n", response.Protocol, response.Status, response.StatusText)
	for _, header := range response.Headers {
		fmt.Printf("%s: %s\n", header.Name, header.Value)
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

func isRedirect(statusCode int) bool {
	return statusCode >= 300 && statusCode < 400
}
