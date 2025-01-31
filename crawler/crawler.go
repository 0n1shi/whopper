package crawler

type Crawler interface {
	SetTimeout(timeoutSeconds uint)
	SetUserAgent(userAgent string)
	Crawl(url string) ([]*Response, error)
}
