package crawler

type Crawler interface {
	SetTimeout(timeoutSeconds uint)
	SetUserAgent(userAgent string)
	SetNoRedirect(noRedirect bool)
	Crawl(url string) (*Result, error)
}
