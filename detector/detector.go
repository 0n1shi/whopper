package detector

import (
	"log/slog"

	"github.com/0n1shi/whopper/analyzer"
	"github.com/0n1shi/whopper/crawler"
)

func Detect(url string) error {
	slog.Info("starting to detect", "url", url)

	responses, err := crawler.Crawl(url)
	if err != nil {
		return err
	}

	results := analyzer.Analyze(responses)
	for _, result := range results {
		slog.Info("detected", "name", result.Name, "versions", result.Versions, "tags", result.Tags)
	}

	return nil
}
