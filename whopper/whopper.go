package whopper

import (
	"log/slog"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
	"github.com/0n1shi/whopper/printer"
)

type Whopper struct {
	debugMode bool
	printer   printer.Printer
	crawler   crawler.Crawler
}

func NewWhopper(debugMode bool, p printer.Printer, c crawler.Crawler) *Whopper {
	return &Whopper{
		debugMode: debugMode,
		printer:   p,
		crawler:   c,
	}
}

func (w *Whopper) Run(url string) error {
	slog.Info("starting to detect ...", "url", url)

	responses, err := w.crawler.Crawl(url)
	if err != nil {
		return err
	}

	if w.debugMode {
		for i, response := range responses {
			if i > 10 {
				break
			}
			crawler.DumpResponse(response)
		}
	}

	results := analyzer.Analyze(responses)

	w.printer.Print(results)

	return nil
}
