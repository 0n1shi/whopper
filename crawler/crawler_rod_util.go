package crawler

import (
	"log/slog"

	"github.com/go-rod/rod/lib/proto"
)

func headerToModels(protoHeaders proto.NetworkHeaders) []*Header {
	headers := []*Header{}
	for key, val := range protoHeaders {
		str := ""
		if err := val.Unmarshal(&str); err != nil {
			slog.Warn("failed to unmarshal header", "header", key, "value", val, "error", err)
			continue
		}
		headers = append(headers, &Header{
			Name:  key,
			Value: str,
		})
	}
	return headers
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
