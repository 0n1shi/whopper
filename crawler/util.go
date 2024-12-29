package crawler

import (
	"fmt"
	"log/slog"
)

const urlMaxLengthToShow = 70
const bodyMaxLengthToShow = 100

func DumpResponse(response *Response) {
	slog.Debug("dumping responses", "url", omitURL(response.Url))
	fmt.Printf("%s %d %s\n", response.Protocol, response.Status, response.StatusText)
	for _, header := range response.Headers {
		fmt.Printf("%s: %s\n", header.Name, header.Value)
	}
	fmt.Println()
	if response.ResourceType == ResourceTypeDocument || response.ResourceType == ResourceTypeScript || response.ResourceType == ResourceTypeStylesheet {
		fmt.Println(omitBody(response.Body))
		fmt.Println()
	}
}

func omitURL(url string) string {
	if len(url) > urlMaxLengthToShow {
		return url[:urlMaxLengthToShow] + "..."
	}
	return url
}

func omitBody(body string) string {
	if len(body) > bodyMaxLengthToShow {
		return body[:bodyMaxLengthToShow] + "..."
	}
	return body
}
