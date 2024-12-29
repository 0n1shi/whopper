package whopper

import (
	"log/slog"

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
}

func NewWhopper(debugMode bool, p printer.Printer, c crawler.Crawler, is []inspector.Inspector) *Whopper {
	return &Whopper{
		debugMode:  debugMode,
		printer:    p,
		crawler:    c,
		inspectors: is,
	}
}

func (w *Whopper) Run(url string) error {
	slog.Info("starting ...", "url", url)

	responses, err := w.crawler.Crawl(url)
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

	analyzer := analyzer.NewAnalyzer(signature.Signatures)
	results := analyzer.Analyze(responses)

	w.printer.Print(results)

	return nil
}
