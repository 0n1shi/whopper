package crawler

type Crawler interface {
	Crawl(url string) ([]*Response, error)
}
