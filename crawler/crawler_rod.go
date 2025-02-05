package crawler

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"net/url"
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
	onlySameHost   bool
}

var _ Crawler = &RodCrawler{}

func NewRodCrawler() *RodCrawler {
	return &RodCrawler{}
}

func (c *RodCrawler) SetTimeout(timeoutSeconds uint) {
	c.timeoutSeconds = timeoutSeconds
}

func (c *RodCrawler) SetUserAgent(userAgent string) {
	c.userAgent = userAgent
}

func (c *RodCrawler) SetOnlySameHost(onlySameHost bool) {
	c.onlySameHost = onlySameHost
}

func (c *RodCrawler) Crawl(targetUrl string) ([]*Response, error) {
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
	var firstPageUrl *string
	page := browser.MustPage()
	defer page.MustClose()
	go page.EachEvent(func(event *proto.NetworkResponseReceived) {
		url := omitURL(event.Response.URL)
		slog.Debug("received response", "url", url, "status", event.Response.Status)

		if firstPageUrl == nil {
			firstPageUrl = &event.Response.URL
		}

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
	if c.userAgent != "" {
		if err := page.SetUserAgent(&proto.NetworkSetUserAgentOverride{
			UserAgent: c.userAgent,
		}); err != nil {
			slog.Warn("failed to set user agent", "error", err)
		}
	}
	if err := page.Navigate(targetUrl); err != nil {
		slog.Error("failed to navigate to the URL", "error", err)
		return nil, errors.New("failed to navigate to the URL")
	}
	if err := page.Timeout(time.Duration(c.timeoutSeconds) * time.Second).WaitLoad(); err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			slog.Warn("timeout loading page", "timeout", strconv.Itoa(1)+"s")
		} else {
			slog.Error("failed to navigate to the URL", "error", err)
			return nil, errors.New("failed to navigate to the URL")
		}
	}
	slog.Info("page loaded")

	if c.onlySameHost {
		if firstPageUrl == nil {
			slog.Warn("no URL is loaded")
			return nil, errors.New("no URL is loaded")
		}

		parsedFirstPageUrl, _ := url.Parse(*firstPageUrl)
		firstPageHost := parsedFirstPageUrl.Hostname()
		parsedTargetUrl, _ := url.Parse(targetUrl)
		targetHost := parsedTargetUrl.Hostname()
		if firstPageHost != targetHost {
			slog.Warn("hostname is not the same as the first page", "target", targetHost, "first page", firstPageHost)
			return nil, fmt.Errorf("hostname is not the same as the first page: %s", firstPageHost)
		}
	}

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
