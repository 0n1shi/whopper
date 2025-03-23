package crawler

const urlMaxLengthToShow = 70

func omitURL(url string) string {
	if len(url) > urlMaxLengthToShow {
		return url[:urlMaxLengthToShow] + "..."
	}
	return url
}

func isRedirect(status int) bool {
	return status >= 300 && status < 400
}
