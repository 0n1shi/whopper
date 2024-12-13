package crawler

import (
	"log/slog"
	"time"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
	"github.com/go-rod/rod/lib/proto"
)

func Crawl(url string) ([]*Response, error) {
	slog.Info("launching browser ...")
	debugUrl := launcher.New().Headless(true).MustLaunch()
	slog.Info("debug URL", "url", debugUrl)

	slog.Info("connecting to browser ...")
	browser := rod.New().ControlURL(debugUrl).MustConnect()
	defer browser.MustClose()

	responses := []*Response{}
	page := browser.MustPage()
	go page.EachEvent(func(res *proto.NetworkResponseReceived) {
		slog.Info("received response", "url", res.Response.URL, "status", res.Response.Status)
		responseBody, err := proto.NetworkGetResponseBody{RequestID: res.RequestID}.Call(page)
		if err != nil {
			slog.Warn("failed to get response body", "error", err)
			return
		}
		responses = append(responses, &Response{
			Url:          res.Response.URL,
			Status:       res.Response.Status,
			StatusText:   res.Response.StatusText,
			Protocol:     res.Response.Protocol,
			ResourceType: ResourceType(res.Type),
			Headers:      headerToMap(res.Response.Headers),
			MimeType:     res.Response.MIMEType,
			Body:         responseBody.Body,
		})
	})()

	slog.Info("navigating to the URL ...")
	page.MustNavigate(url)
	page.MustWaitLoad()
	slog.Info("page loaded")

	time.Sleep(1 * time.Second) // Wait for all events to be processed

	slog.Info("received responses", "count", len(responses))

	slog.Info("closing browser ...")
	return responses, nil
}
