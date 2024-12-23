package crawler

type RequestID string

type Response struct {
	Url          string
	Status       int
	StatusText   string
	Protocol     string
	ResourceType ResourceType
	Headers      map[string]string
	Cookies      []*Cookie
	MimeType     string
	Body         string
}
