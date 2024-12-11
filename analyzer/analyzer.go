package analyzer

import "github.com/go-rod/rod/lib/proto"

var signatures = []signature{
	&nginxSignature{},
}

func Analyze(responses []*proto.NetworkResponseReceived) []*Result {
	results := []*Result{}

	for _, sig := range signatures {
		if sig.Check(responses) {
			results = append(results, &Result{
				Name:     sig.Name(),
				Versions: sig.Versions(responses),
				Tags:     sig.Tags(),
			})
		}
	}

	return results
}
