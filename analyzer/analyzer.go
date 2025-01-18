package analyzer

import (
	"net/url"
	"regexp"

	"github.com/0n1shi/whopper/crawler"
)

func Analyze(response *crawler.Response, signature *Signature, targetHost string) (isDetected bool, version string) {
	responseUrl, _ := url.Parse(response.Url)
	responseHost := responseUrl.Hostname()
	if signature.OnlySameHost && responseHost != targetHost {
		return false, ""
	}
	for _, re := range signature.BodyRegexps {
		matches := regexp.MustCompile(re).FindStringSubmatch(response.Body)
		if len(matches) > 1 {
			return true, matches[1]
		}
		if len(matches) > 0 {
			isDetected = true
		}
	}
	for _, re := range signature.UrlRegexps {
		matches := regexp.MustCompile(re).FindStringSubmatch(response.Url)
		if len(matches) > 1 {
			return true, matches[1]
		}
		if len(matches) > 0 {
			isDetected = true
		}
	}
	for _, sig := range signature.HeaderSignatures {
		for _, header := range response.Headers {
			if header.Name == sig.Name {
				matches := regexp.MustCompile(sig.ValueRegexp).FindStringSubmatch(header.Value)
				if len(matches) > 1 {
					return true, matches[1]
				}
				if len(matches) > 0 {
					isDetected = true
				}
			}
		}
	}
	return isDetected, ""
}

func AnalyzeAll(responses []*crawler.Response, signatures []*Signature, targetHost string) []*Result {
	results := []*Result{}
	for _, signature := range signatures {
		isDetected := false
		versions := []string{}
		for _, response := range responses {
			found, ver := Analyze(response, signature, targetHost)
			if found {
				isDetected = true
				versions = append(versions, ver)
			}
		}
		if isDetected {
			results = append(results, &Result{
				Name:        signature.Name,
				Description: signature.Description,
				Versions:    unique(versions),
				CPEs:        versToCPEs(unique(versions), signature.Cpe),
				Tags:        signature.Tags,
			})
		}
	}
	return results
}
