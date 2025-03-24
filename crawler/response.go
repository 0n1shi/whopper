package crawler

type RequestID string

type Response struct {
	BrowserURL   string
	URL          string
	Status       int
	StatusText   string
	Protocol     string
	ResourceType ResourceType
	Headers      []*Header
	Cookies      []*Cookie
	MimeType     string
	Body         string
}
