package crawler

import (
	"log/slog"
	"time"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
	"github.com/go-rod/rod/lib/proto"
)

func Crawl(url string) ([]*proto.NetworkResponseReceived, error) {
	debugUrl := launcher.New().Headless(true).MustLaunch()
	slog.Info("debug URL", "url", debugUrl)

	slog.Info("connecting to browser ...")
	browser := rod.New().ControlURL(debugUrl).MustConnect()
	defer browser.MustClose()

	receivedResponses := []*proto.NetworkResponseReceived{}
	page := browser.MustPage()
	go page.EachEvent(func(e *proto.NetworkResponseReceived) {
		slog.Info("response URL", "url", e.Response.URL, "status", e.Response.Status)
		receivedResponses = append(receivedResponses, e)
	})()

	slog.Info("navigating to the URL")
	page.MustNavigate(url)
	page.MustWaitLoad()
	slog.Info("page loaded")

	time.Sleep(1 * time.Second) // Wait for all events to be processed

	slog.Info("received responses", "count", len(receivedResponses))

	slog.Info("closing browser ...")
	return receivedResponses, nil
}
