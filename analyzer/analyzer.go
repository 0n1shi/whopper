package analyzer

import (
	"github.com/0n1shi/whopper/crawler"
	"github.com/0n1shi/whopper/signature"
)

func Analyze(res *crawler.Response, sig *signature.Signature, targetHost string) (detected bool, version string) {
	if signature.Detect(res, sig, targetHost) {
		return true, signature.GetVersion(res, sig)
	}
	return false, ""
}

func AnalyzeAll(responses []*crawler.Response, signatures []*signature.Signature, targetHost string) []*Result {
	results := []*Result{}
	for _, signature := range signatures {
		detected := false
		versions := []string{}
		for _, response := range responses {
			found, ver := Analyze(response, signature, targetHost)
			if found {
				detected = true
				if ver != "" {
					versions = append(versions, ver)
				}
			}
		}
		if detected {
			results = append(results, &Result{
				Name:        signature.Name,
				Description: signature.Description,
				Versions:    unique(versions),
				CPEs:        versToCPEs(unique(versions), signature.Cpe),
			})
		}
	}
	return results
}
