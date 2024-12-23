package whopper

import (
	"log/slog"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
	"github.com/0n1shi/whopper/investigator"
	"github.com/0n1shi/whopper/printer"
)

type Whopper struct {
	debugMode  bool
	printer    printer.Printer
	crawler    crawler.Crawler
	integrator *investigator.Investigator
}

func NewWhopper(debugMode bool, p printer.Printer, c crawler.Crawler, i *investigator.Investigator) *Whopper {
	return &Whopper{
		debugMode:  debugMode,
		printer:    p,
		crawler:    c,
		integrator: i,
	}
}

func (w *Whopper) Run(url string) error {
	slog.Info("starting ...", "url", url)

	responses, err := w.crawler.Crawl(url)
	if err != nil {
		return err
	}

	if w.integrator != nil {
		w.integrator.SearchWord(responses)
		slog.Info("skipping analysis because search word is set")
		return nil
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
