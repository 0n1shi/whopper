package crawler

type Response struct {
	Url          string
	Status       int
	ResourceType string
	Headers      map[string]string
	MimeType     string
}
