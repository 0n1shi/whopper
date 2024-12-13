package detector

import (
	"log/slog"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

type Detector struct {
	dumpResponse bool
}

func NewDetector(dumpResponse bool) *Detector {
	return &Detector{dumpResponse: dumpResponse}
}

func (detector *Detector) Detect(url string) error {
	slog.Info("starting to detect", "url", url)

	responses, err := crawler.Crawl(url)
	if err != nil {
		return err
	}

	if detector.dumpResponse {
		for _, response := range responses {
			crawler.DumpResponse(response)
		}
	}

	results := analyzer.Analyze(responses)
	for _, result := range results {
		slog.Info("detected", "name", result.Name, "versions", result.Versions, "tags", result.Tags)
	}

	return nil
}
