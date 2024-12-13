package crawler

type ResourceType string

const (
	ResourceTypeDocument           ResourceType = "Document"
	ResourceTypeStylesheet         ResourceType = "Stylesheet"
	ResourceTypeImage              ResourceType = "Image"
	ResourceTypeMedia              ResourceType = "Media"
	ResourceTypeFont               ResourceType = "Font"
	ResourceTypeScript             ResourceType = "Script"
	ResourceTypeTextTrack          ResourceType = "TextTrack"
	ResourceTypeXHR                ResourceType = "XHR"
	ResourceTypeFetch              ResourceType = "Fetch"
	ResourceTypePrefetch           ResourceType = "Prefetch"
	ResourceTypeEventSource        ResourceType = "EventSource"
	ResourceTypeWebSocket          ResourceType = "WebSocket"
	ResourceTypeManifest           ResourceType = "Manifest"
	ResourceTypeSignedExchange     ResourceType = "SignedExchange"
	ResourceTypePing               ResourceType = "Ping"
	ResourceTypeCSPViolationReport ResourceType = "CSPViolationReport"
	ResourceTypePreflight          ResourceType = "Preflight"
	ResourceTypeOther              ResourceType = "Other"
)
