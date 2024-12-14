package whopper

import (
	"log/slog"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type Whopper struct {
	debugMode bool
}

func NewWhopper(debugMode bool) *Whopper {
	return &Whopper{debugMode: debugMode}
}

func (w *Whopper) Run(url string) error {
	slog.Info("starting to detect ...", "url", url)

	responses, err := crawler.Crawl(url)
	if err != nil {
		return err
	}

	if w.debugMode {
		for _, response := range responses {
			crawler.DumpResponse(response)
		}
	}

	results := analyzer.Analyze(responses)
	for _, result := range results {
		slog.Error("detected", "name", result.Name, "versions", result.Versions, "tags", result.Tags)
	}

	return nil
}
