package investigator

import (
	"fmt"
	"log/slog"
	"strings"

	"github.com/0n1shi/whopper/crawler"
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

	// Search for the word in the URLs
	for _, response := range responses {
		lowerCaseUrl := strings.ToLower(response.Url)
		if strings.Contains(lowerCaseUrl, lowerCaseWord) {
			fmt.Println(response.Url)
		}
	}

	// Search for the word in the headers
	for _, response := range responses {
		for key, value := range response.Headers {
			lowerCaseKey := strings.ToLower(key)
			lowerCaseValue := strings.ToLower(value)
			if strings.Contains(lowerCaseKey, lowerCaseWord) ||
				strings.Contains(lowerCaseValue, lowerCaseWord) {
				fmt.Printf("%s: %s\n", strings.TrimSpace(key), strings.TrimSpace(value))
			}
		}
	}

	// Search for the word in the bodies
	for _, response := range responses {
		for i, line := range strings.Split(response.Body, "\n") {
			lowerCaseLine := strings.ToLower(line)
			if strings.Contains(lowerCaseLine, lowerCaseWord) {
				fmt.Printf("%s:%d: %s\n", response.Url, i+1, strings.TrimSpace(line))
			}
		}
	}
}
