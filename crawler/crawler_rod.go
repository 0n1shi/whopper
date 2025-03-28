package crawler

import (
	"context"
	"errors"
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
	noRedirect     bool
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

func (c *RodCrawler) SetNoRedirect(noRedirect bool) {
	c.noRedirect = noRedirect
}

func (c *RodCrawler) Crawl(targetURL string) (*Result, error) {
	parsedURL, err := url.Parse(targetURL)
	if err != nil {
		slog.Error("failed to parse URL", "URL", targetURL, "error", err)
		return nil, err
	}
	tartgetHostname := parsedURL.Hostname()

	slog.Debug("launching browser ...")
	launcher := launcher.New()
	defer launcher.Cleanup() // remove user data such as cookies, cache, etc.

	debugURL, err := launcher.Headless(true).Launch()
	if err != nil {
		slog.Error("failed to launch browser", "error", err)
		return nil, err
	}
	slog.Debug("debug URL", "url", debugURL)

	slog.Debug("connecting to browser ...")
	browser := rod.New().ControlURL(debugURL)
	if err := browser.Connect(); err != nil {
		slog.Error("failed to connect to browser", "error", err)
		return nil, err
	}
	defer browser.MustClose()

	if err := browser.IgnoreCertErrors(true); err != nil {
		slog.Warn("failed to ignore certificate errors", "error", err)
	}

	page, err := browser.Page(proto.TargetCreateTarget{URL: "about:blank"})
	if err != nil {
		slog.Error("failed to create a new page", "error", err)
		return nil, err
	}
	defer page.Close()
	pageFrameID := page.FrameID
	slog.Debug("Page frame", "id", pageFrameID)

	responseMap := map[string]*Response{}
	notFoundRequestIDs := []string{}
	mu := &sync.Mutex{}
	go page.EachEvent(func(event *proto.NetworkResponseReceived) {
		slog.Debug("received response", "url", omitURL(event.Response.URL), "status", event.Response.Status, "resource_type", event.Type, "frame_id", event.FrameID)

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
			FrameID:      string(event.FrameID),
			BrowserURL:   page.MustInfo().URL,
			URL:          event.Response.URL,
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
			slog.Warn(
				"failed to get response body",
				"url", omitURL(response.URL),
				"error", err,
			)
			return
		}

		mu.Lock()
		response.Body = reply.Body
		mu.Unlock()
	}, func(event *proto.FetchRequestPaused) {
		if event.ResponseStatusCode == nil {
			_ = proto.FetchContinueRequest{
				RequestID:         event.RequestID,
				InterceptResponse: true,
			}.Call(page)
			return
		}

		if event.ResponseStatusCode != nil {
			slog.Debug("intercepted response", "url", event.Request.URL, "status", *event.ResponseStatusCode, "resource_type", event.ResourceType, "frame_id", event.FrameID)

			if c.noRedirect {
				requestURL, err := url.Parse(event.Request.URL)
				if err != nil {
					slog.Warn("failed to parse request URL", "URL", event.Request.URL, "error", err)
				}
				if requestURL.Hostname() != tartgetHostname && event.ResourceType == proto.NetworkResourceTypeDocument {
					err := proto.FetchFailRequest{
						RequestID:   event.RequestID,
						ErrorReason: proto.NetworkErrorReasonAborted,
					}.Call(page)
					if err != nil {
						slog.Warn("failed to fail the request", "error", err)
					}
					return
				}
			}

			cookies := []*Cookie{}
			cookieReply, err := proto.NetworkGetCookies{Urls: []string{event.Request.URL}}.Call(page)
			if err != nil {
				slog.Warn(
					"failed to get cookies",
					"url", event.Request.URL,
					"error", err,
				)
			} else {
				cookies = cookieToModels(cookieReply.Cookies)
			}
			modelHeaders := headerEntriesToModels(event.ResponseHeaders)

			mu.Lock()
			responseMap[string(event.RequestID)] = &Response{
				FrameID:    string(event.FrameID),
				BrowserURL: page.MustInfo().URL,
				URL:        event.Request.URL,
				Status:     *event.ResponseStatusCode,
				StatusText: http.StatusText(*event.ResponseStatusCode),
				Headers:    modelHeaders,
				Cookies:    cookies,
			}
			mu.Unlock()
		}

		err := proto.FetchContinueRequest{RequestID: event.RequestID, InterceptResponse: true}.Call(page)
		if err != nil {
			slog.Warn("failed to continue the request", "error", err)
		}
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
	if err := page.Navigate(targetURL); err != nil {
		if err.Error() == "navigation failed: net::ERR_ABORTED" {
			slog.Warn("navigation aborted", "URL", targetURL)
		} else {
			slog.Error("failed to navigate to the URL", "error", err)
			return nil, errors.New("failed to navigate to the URL")
		}
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

	time.Sleep(3 * time.Second) // Wait for all events to be processed

	for _, requestID := range notFoundRequestIDs {
		if res, ok := responseMap[requestID]; ok {
			slog.Warn("failed to get response body", "URL", res.URL)
		}
	}

	responses := []*Response{}
	for _, response := range responseMap {
		slog.Debug("response", "url", response.URL, "status", response.Status)
		responses = append(responses, response)
	}
	slog.Info("received responses", "count", len(responses))

	slog.Debug("closing browser ...")
	return &Result{
		PageFrameID: string(pageFrameID),
		Responses:   responses,
	}, nil
}
