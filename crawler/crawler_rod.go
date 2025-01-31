package crawler

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
	"github.com/go-rod/rod/lib/proto"
)

type RodCrawler struct {
	timeoutSeconds uint
	userAgent      string
}

var _ Crawler = (*RodCrawler)(nil)

func NewRodCrawler() *RodCrawler {
	return &RodCrawler{}
}

func (c *RodCrawler) SetTimeout(timeoutSeconds uint) {
	c.timeoutSeconds = timeoutSeconds
}

func (c *RodCrawler) SetUserAgent(userAgent string) {
	c.userAgent = userAgent
}

func (c *RodCrawler) Crawl(url string) ([]*Response, error) {
	slog.Debug("launching browser ...")
	launcher := launcher.New()
	defer launcher.Cleanup() // remove user data such as cookies, cache, etc.
	debugUrl := launcher.Headless(true).MustLaunch()
	slog.Debug("debug URL", "url", debugUrl)

	slog.Debug("connecting to browser ...")
	browser := rod.New().ControlURL(debugUrl).MustConnect()
	if err := browser.IgnoreCertErrors(true); err != nil {
		slog.Warn("failed to ignore certificate errors", "error", err)
	}
	defer browser.MustClose()

	responseMap := map[string]*Response{}
	notFoundRequestIDs := []string{}
	mu := &sync.Mutex{}
	page := browser.MustPage()
	defer page.MustClose()
	go page.EachEvent(func(event *proto.NetworkResponseReceived) {
		url := omitURL(event.Response.URL)
		slog.Debug("received response", "url", url, "status", event.Response.Status)

		cookies := []*Cookie{}
		cookieReply, err := proto.NetworkGetCookies{Urls: []string{event.Response.URL}}.Call(page)
		if err != nil {
			slog.Warn(
				"failed to get cookies",
				"url", event.Response.URL,
				"error", err,
			)
		} else {
			cookies = cookieToModels(cookieReply.Cookies)
		}

		mu.Lock()
		responseMap[string(event.RequestID)] = &Response{
			Url:          event.Response.URL,
			Status:       event.Response.Status,
			StatusText:   http.StatusText(event.Response.Status),
			Protocol:     event.Response.Protocol,
			ResourceType: ResourceType(event.Type),
			Headers:      headerToModels(event.Response.Headers),
			Cookies:      cookies,
			MimeType:     event.Response.MIMEType,
			Body:         "",
		}
		mu.Unlock()
	}, func(event *proto.NetworkLoadingFinished) {
		response, ok := responseMap[string(event.RequestID)]
		if !ok {
			notFoundRequestIDs = append(notFoundRequestIDs, string(event.RequestID))
			return
		}

		if response.ResourceType != ResourceTypeDocument &&
			response.ResourceType != ResourceTypeScript &&
			response.ResourceType != ResourceTypeStylesheet {
			return
		}

		reply, err := proto.NetworkGetResponseBody{RequestID: event.RequestID}.Call(page)
		if err != nil {
			url := omitURL(response.Url)
			slog.Warn(
				"failed to get response body",
				"url", url,
				"error", err,
			)
			return
		}

		mu.Lock()
		response.Body = reply.Body
		mu.Unlock()
	})()
	time.Sleep(3 * time.Second) // Wait for the event handler to be registered

	slog.Info("navigating to the URL ...")
	err := rod.Try(func() {
		if c.userAgent != "" {
			if err := page.SetUserAgent(&proto.NetworkSetUserAgentOverride{
				UserAgent: c.userAgent,
			}); err != nil {
				slog.Warn("failed to set user agent", "error", err)
			}
		}
		page.MustNavigate(url)
		page.Timeout(time.Duration(c.timeoutSeconds) * time.Second).MustWaitLoad()
	})
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			slog.Warn("timeout loading page", "timeout", strconv.Itoa(1)+"s")
		} else {
			slog.Warn("failed to navigate to the URL", "error", err)
			return nil, err
		}
	}
	slog.Info("page loaded")

	time.Sleep(3 * time.Second) // Wait for all events to be processed

	for _, requestID := range notFoundRequestIDs {
		if res, ok := responseMap[requestID]; ok {
			slog.Warn("failed to get response body", "URL", res.Url)
		}
	}

	responses := []*Response{}
	for _, response := range responseMap {
		responses = append(responses, response)
	}
	slog.Info("received responses", "count", len(responses))

	slog.Debug("closing browser ...")
	return responses, nil
}
