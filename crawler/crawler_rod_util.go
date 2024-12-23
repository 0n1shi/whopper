package crawler

import (
	"log/slog"

	"github.com/go-rod/rod/lib/proto"
)

func headerToMap(headers proto.NetworkHeaders) map[string]string {
	headerMap := make(map[string]string)
	for key, val := range headers {
		str := ""
		if err := val.Unmarshal(&str); err != nil {
			slog.Warn("failed to unmarshal header", "header", key, "value", val, "error", err)
			continue
		}
		headerMap[key] = str
	}
	return headerMap
}

func cookieToModels(cookies []*proto.NetworkCookie) []*Cookie {
	cookieModels := make([]*Cookie, len(cookies))
	for i, cookie := range cookies {
		cookieModels[i] = &Cookie{
			Name:  cookie.Name,
			Value: cookie.Value,
		}
	}
	return cookieModels
}
