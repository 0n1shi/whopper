package investigator

import (
	"fmt"
	"log/slog"
	"strings"

	"github.com/0n1shi/whopper/crawler"
)

const (
	maxURLLengthToShow         = 57
	maxBodyLengthToShow        = 97
	maxCookieValueLengthToShow = 57
	maxHeaderValueLengthToShow = 57
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
		hit := false
		lowerCaseUrl := strings.ToLower(response.Url)
		if strings.Contains(lowerCaseUrl, lowerCaseWord) {
			if !hit {
				fmt.Println("URL:", response.Url)
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
		for key, value := range response.Headers {
			lowerCaseKey := strings.ToLower(key)
			lowerCaseValue := strings.ToLower(value)
			if strings.Contains(lowerCaseKey, lowerCaseWord) ||
				strings.Contains(lowerCaseValue, lowerCaseWord) {
				if !hit {
					fmt.Println("URL:", response.Url)
					hit = true
				}
				headerValue := strings.TrimSpace(value)
				if len(headerValue) > maxHeaderValueLengthToShow {
					headerValue = value[:maxHeaderValueLengthToShow] + "..."
				}
				fmt.Printf("%s: %s\n", strings.TrimSpace(key), headerValue)
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
					fmt.Println("URL:", response.Url)
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
					fmt.Println("URL:", response.Url)
					hit = true
				}
				bodyLine := strings.TrimSpace(line)
				if len(bodyLine) > maxBodyLengthToShow {
					bodyLine = line[:maxBodyLengthToShow] + "..."
				}
				fmt.Printf("%s:%d: %s\n", response.Url, i+1, bodyLine)
			}
		}
	}
}
