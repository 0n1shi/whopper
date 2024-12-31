package inspector

import "strings"

const (
	maxURLLengthToShow         = 57
	maxBodyLengthToShow        = 97
	maxCookieValueLengthToShow = 57
	maxHeaderValueLengthToShow = 57
)

func omitURL(url string) string {
	url = strings.TrimSpace(url)
	if len(url) > maxURLLengthToShow {
		return url[:maxURLLengthToShow] + "..."
	}
	return url
}

func omitCookieValue(value string) string {
	value = strings.TrimSpace(value)
	if len(value) > maxCookieValueLengthToShow {
		return value[:maxCookieValueLengthToShow] + "..."
	}
	return value
}

func omitHeaderValue(value string) string {
	value = strings.TrimSpace(value)
	if len(value) > maxHeaderValueLengthToShow {
		return value[:maxHeaderValueLengthToShow] + "..."
	}
	return value
}

func omitBody(body string) string {
	body = strings.TrimSpace(body)
	if len(body) > maxBodyLengthToShow {
		return body[:maxBodyLengthToShow] + "..."
	}
	return body
}
