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
	targetURL  string
}

func NewWhopper(debugMode bool, p printer.Printer, c crawler.Crawler, is []inspector.Inspector, targetURL string) *Whopper {
	return &Whopper{
		debugMode:  debugMode,
		printer:    p,
		crawler:    c,
		inspectors: is,
		targetURL:  targetURL,
	}
}

func (w *Whopper) Run() error {
	slog.Info("starting ...", "url", w.targetURL)

	responses, err := w.crawler.Crawl(w.targetURL)
	if err != nil {
		w.printer.Print(nil, err)
		return err
	}

	if len(w.inspectors) > 0 {
		for _, inspector := range w.inspectors {
			inspector.Inspect(responses)
		}
		return nil // skip the analysis
	}

	targetURL, _ := url.Parse(w.targetURL)
	targetHost := targetURL.Hostname()
	results := analyzer.AnalyzeAll(responses, signature.Signatures, targetHost)

	w.printer.Print(results, err)

	return nil
}
