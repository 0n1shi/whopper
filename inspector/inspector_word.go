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
		hit := false
		lowerCaseUrl := strings.ToLower(response.Url)
		if strings.Contains(lowerCaseUrl, lowerCaseWord) {
			if !hit {
				fmt.Println(response.Url)
				hit = true
			}
			url := response.Url
			if len(strings.TrimSpace(url)) > maxURLLengthToShow {
				url = url[:maxURLLengthToShow] + "..."
			}
			fmt.Println("\t", url)
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
					fmt.Println(response.Url)
					hit = true
				}
				headerValue := strings.TrimSpace(header.Value)
				if len(headerValue) > maxHeaderValueLengthToShow {
					headerValue = headerValue[:maxHeaderValueLengthToShow] + "..."
				}
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
					fmt.Println(response.Url)
					hit = true
				}
				cookieValue := strings.TrimSpace(cookie.Value)
				if len(cookieValue) > maxCookieValueLengthToShow {
					cookieValue = cookie.Value[:maxCookieValueLengthToShow] + "..."
				}
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
					fmt.Println(response.Url)
					hit = true
				}
				bodyLine := strings.TrimSpace(line)
				if len(bodyLine) > maxBodyLengthToShow {
					bodyLine = line[:maxBodyLengthToShow] + "..."
				}
				fmt.Printf("\t%d: %s\n", i+1, bodyLine)
			}
		}
	}
}
