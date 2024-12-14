package analyzer

import (
	"github.com/0n1shi/whopper/crawler"
)

func Analyze(responses []*crawler.Response) []*Result {
	results := []*Result{}
	for _, sig := range signatures {
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
