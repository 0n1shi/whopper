package analyzer

import (
	"github.com/0n1shi/whopper/crawler"
)

type analyzeItem struct {
	signature Signature

	isDetected    bool
	foundVersions []string
}

type Analyzer struct {
	items []analyzeItem
}

func NewAnalyzer(signatures []Signature) *Analyzer {
	items := make([]analyzeItem, len(signatures))
	for i, sig := range signatures {
		items[i] = analyzeItem{
			signature: sig,
		}
	}
	return &Analyzer{
		items: items,
	}
}

func (a *Analyzer) Analyze(responses []*crawler.Response) []*Result {
	results := []*Result{}
	for _, item := range a.items {
		for _, response := range responses {
			if item.signature.Check(response) {
				item.isDetected = true

				version := item.signature.Version(response)
				if version != "" {
					item.foundVersions = append(item.foundVersions, version)
				}
			}
		}
		if item.isDetected {
			results = append(results, &Result{
				Name:        item.signature.Name(),
				Description: item.signature.Description(),
				Versions:    unique(item.foundVersions),
				CPEs:        unique(versToCPEs(item.foundVersions, item.signature.CPE)),
				Tags:        item.signature.Tags(),
			})
		}
	}
	return results
}
