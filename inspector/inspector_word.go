package inspector

import (
	"fmt"
	"log/slog"
	"strings"

	"github.com/0n1shi/whopper/crawler"
)

type WordInspector struct {
	wordToSearch string
}

var _ Inspector = (*WordInspector)(nil)

func NewWordInspector(wordToSearch string) Inspector {
	return &WordInspector{
		wordToSearch: wordToSearch,
	}
}

func (i *WordInspector) Inspect(responses []*crawler.Response) {
	slog.Info("searching for ...", "word", i.wordToSearch)
	lowerCaseWord := strings.ToLower(i.wordToSearch)

	slog.Info("searching in URLs ...")
	for _, response := range responses {
		lowerCaseUrl := strings.ToLower(response.URL)
		if strings.Contains(lowerCaseUrl, lowerCaseWord) {
			url := omitURL(response.URL)
			fmt.Println(url)
		}
	}

	slog.Info("searching in headers ...")
	for _, response := range responses {
		hit := false
		for _, header := range response.Headers {
			lowerCaseName := strings.ToLower(header.Name)
			lowerCaseValue := strings.ToLower(header.Value)
			if strings.Contains(lowerCaseName, lowerCaseWord) ||
				strings.Contains(lowerCaseValue, lowerCaseWord) {
				if !hit {
					fmt.Println(response.URL)
					hit = true
				}
				headerValue := omitHeaderValue(header.Value)
				fmt.Printf("\t%s: %s\n", strings.TrimSpace(header.Name), headerValue)
			}
		}
	}

	slog.Info("searching in cookies ...")
	for _, response := range responses {
		hit := false
		for _, cookie := range response.Cookies {
			lowerCaseName := strings.ToLower(cookie.Name)
			lowerCaseValue := strings.ToLower(cookie.Value)
			if strings.Contains(lowerCaseName, lowerCaseWord) ||
				strings.Contains(lowerCaseValue, lowerCaseWord) {
				if !hit {
					fmt.Println(response.URL)
					hit = true
				}
				cookieValue := omitCookieValue(cookie.Value)
				fmt.Printf("\t%s: %s\n", strings.TrimSpace(cookie.Name), cookieValue)
			}
		}
	}

	slog.Info("searching in bodies ...")
	for _, response := range responses {
		hit := false
		for i, line := range strings.Split(response.Body, "\n") {
			lowerCaseLine := strings.ToLower(line)
			if strings.Contains(lowerCaseLine, lowerCaseWord) {
				if !hit {
					fmt.Println(response.URL)
					hit = true
				}
				bodyLine := omitBody(line)
				fmt.Printf("\t%d: %s\n", i+1, bodyLine)
			}
		}
	}
}
