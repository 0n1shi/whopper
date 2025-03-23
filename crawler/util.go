package crawler

const urlMaxLengthToShow = 70

func omitURL(url string) string {
	if len(url) > urlMaxLengthToShow {
		return url[:urlMaxLengthToShow] + "..."
	}
	return url
}
