package crawler

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
	"github.com/go-rod/rod/lib/proto"
)

func Crawl(url string) ([]*Response, error) {
	slog.Debug("launching browser ...")
	debugUrl := launcher.New().Headless(true).MustLaunch()
	slog.Debug("debug URL", "url", debugUrl)

	slog.Debug("connecting to browser ...")
	browser := rod.New().ControlURL(debugUrl).MustConnect()
	defer browser.MustClose()

	responses := []*Response{}
	page := browser.MustPage()
	go page.EachEvent(func(res *proto.NetworkResponseReceived) {
		slog.Debug("received response", "url", res.Response.URL, "status", res.Response.Status)
		body := ""
		resourceType := ResourceType(res.Type)
		if resourceType == ResourceTypeDocument || resourceType == ResourceTypeScript || resourceType == ResourceTypeStylesheet {
			responseBody, err := proto.NetworkGetResponseBody{RequestID: res.RequestID}.Call(page)
			if err != nil {
				slog.Warn("failed to get response body", "requestID", res.RequestID, "error", err.Error())
			}
			body = responseBody.Body
		}
		statusText := http.StatusText(res.Response.Status)
		responses = append(responses, &Response{
			Url:          res.Response.URL,
			Status:       res.Response.Status,
			StatusText:   statusText,
			Protocol:     res.Response.Protocol,
			ResourceType: ResourceType(res.Type),
			Headers:      headerToMap(res.Response.Headers),
			MimeType:     res.Response.MIMEType,
			Body:         body,
		})
	})()

	slog.Info("navigating to the URL ...")
	page.MustNavigate(url)
	page.MustWaitLoad()
	slog.Info("page loaded")

	time.Sleep(1 * time.Second) // Wait for all events to be processed

	slog.Info("received responses", "count", len(responses))

	slog.Debug("closing browser ...")
	return responses, nil
}
