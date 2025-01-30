package crawler

type Crawler interface {
	SetTimeout(timeoutSeconds uint)
	Crawl(url string) ([]*Response, error)
}
