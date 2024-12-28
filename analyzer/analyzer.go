package analyzer

import (
	"github.com/0n1shi/whopper/crawler"
)

type Analyzer struct {
	signatures []Signature
}

func NewAnalyzer(signatures []Signature) *Analyzer {
	return &Analyzer{
		signatures: signatures,
	}
}

func (a *Analyzer) Analyze(responses []*crawler.Response) []*Result {
	results := []*Result{}
	for _, sig := range a.signatures {
		if sig.Check(responses) {
			results = append(results, &Result{
				Name:        sig.Name(),
				Description: sig.Description(),
				Versions:    sig.Versions(responses),
				Tags:        sig.Tags(),
			})
		}
	}
	return results
}
