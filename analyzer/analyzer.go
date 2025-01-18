package analyzer

import (
	"net/url"

	"github.com/0n1shi/whopper/crawler"
	"github.com/0n1shi/whopper/signature"
)

func Analyze(res *crawler.Response, sig *signature.Signature, targetHost string) (detected bool, version string) {
	resUrl, _ := url.Parse(res.Url)
	resHost := resUrl.Hostname()
	if sig.OnlySameHost && resHost != targetHost {
		return false, ""
	}
	if signature.Detect(res, sig, targetHost) {
		return true, signature.ExtractVersion(res, sig)
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
				versions = append(versions, ver)
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
