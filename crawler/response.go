package crawler

type RequestID string

type Response struct {
	Url          string
	Status       int
	StatusText   string
	Protocol     string
	ResourceType ResourceType
	Headers      []*Header
	Cookies      []*Cookie
	MimeType     string
	Body         string
}
