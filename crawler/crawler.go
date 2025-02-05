package crawler

type Crawler interface {
	SetTimeout(timeoutSeconds uint)
	SetUserAgent(userAgent string)
	SetOnlySameHost(onlySameHost bool)
	Crawl(url string) ([]*Response, error)
}
