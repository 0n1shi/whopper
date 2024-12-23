package investigator

import (
	"fmt"
	"log/slog"
	"strings"

	"github.com/0n1shi/whopper/crawler"
)

const (
	showLineLength = 97
)

type Investigator struct {
	wordToSearch string
}

func NewInvestigator(wordToSearch string) *Investigator {
	return &Investigator{
		wordToSearch: wordToSearch,
	}
}

func (i *Investigator) SearchWord(responses []*crawler.Response) {
	slog.Info("searching for ...", "word", i.wordToSearch)
	lowerCaseWord := strings.ToLower(i.wordToSearch)

	slog.Info("searching in URLs ...")
	for _, response := range responses {
		lowerCaseUrl := strings.ToLower(response.Url)
		if strings.Contains(lowerCaseUrl, lowerCaseWord) {
			url := response.Url
			if len(strings.TrimSpace(url)) > showLineLength {
				url = url[:showLineLength] + "..."
			}
			fmt.Println(url)
		}
	}

	slog.Info("searching in headers ...")
	for _, response := range responses {
		for key, value := range response.Headers {
			lowerCaseKey := strings.ToLower(key)
			lowerCaseValue := strings.ToLower(value)
			if strings.Contains(lowerCaseKey, lowerCaseWord) ||
				strings.Contains(lowerCaseValue, lowerCaseWord) {
				if len(strings.TrimSpace(value)) > showLineLength {
					value = value[:showLineLength] + "..."
				}
				fmt.Printf("%s: %s\n", strings.TrimSpace(key), strings.TrimSpace(value))
			}
		}
	}

	slog.Info("searching in bodies ...")
	for _, response := range responses {
		for i, line := range strings.Split(response.Body, "\n") {
			lowerCaseLine := strings.ToLower(line)
			if strings.Contains(lowerCaseLine, lowerCaseWord) {
				if len(strings.TrimSpace(line)) > showLineLength {
					line = line[:showLineLength] + "..."
				}
				fmt.Printf("%s:%d: %s\n", response.Url, i+1, strings.TrimSpace(line))
			}
		}
	}
}
