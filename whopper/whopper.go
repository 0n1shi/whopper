package whopper

import (
	"log/slog"
	"net/url"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
	"github.com/0n1shi/whopper/inspector"
	"github.com/0n1shi/whopper/printer"
	"github.com/0n1shi/whopper/signature"
)

type Whopper struct {
	debugMode  bool
	printer    printer.Printer
	crawler    crawler.Crawler
	inspectors []inspector.Inspector
	targetUrl  string
}

func NewWhopper(debugMode bool, p printer.Printer, c crawler.Crawler, is []inspector.Inspector, targetUrl string) *Whopper {
	return &Whopper{
		debugMode:  debugMode,
		printer:    p,
		crawler:    c,
		inspectors: is,
		targetUrl:  targetUrl,
	}
}

func (w *Whopper) Run() error {
	slog.Info("starting ...", "url", w.targetUrl)

	responses, err := w.crawler.Crawl(w.targetUrl)
	if err != nil {
		return err
	}

	if len(w.inspectors) > 0 {
		for _, inspector := range w.inspectors {
			inspector.Inspect(responses)
		}
		return nil // skip the analysis
	}

	if w.debugMode {
		for i, response := range responses {
			if i > 10 {
				break
			}
			crawler.DumpResponse(response)
		}
	}

	targetUrl, _ := url.Parse(w.targetUrl)
	targetHost := targetUrl.Hostname()
	results := analyzer.AnalyzeAll(responses, signature.Signatures, targetHost)

	w.printer.Print(results)

	return nil
}
