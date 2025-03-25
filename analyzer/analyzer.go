package analyzer

import (
	"github.com/0n1shi/whopper/crawler"
	"github.com/0n1shi/whopper/signature"
)

func Analyze(pageFrameID string, res *crawler.Response, sig *signature.Signature) (detected bool, version string) {
	if pageFrameID != res.FrameID { // skip iframes
		return false, ""
	}
	if signature.Detect(res, sig) {
		return true, signature.GetVersion(res, sig)
	}
	return false, ""
}

func AnalyzeAll(result *crawler.Result, signatures []*signature.Signature) []*Tech {
	techs := []*Tech{}
	for _, signature := range signatures {
		detected := false
		versions := []string{}
		for _, response := range result.Responses {
			found, ver := Analyze(result.PageFrameID, response, signature)
			if found {
				detected = true
				if ver != "" {
					versions = append(versions, ver)
				}
			}
		}
		if detected {
			techs = append(techs, &Tech{
				Name:        signature.Name,
				Description: signature.Description,
				Versions:    unique(versions),
				CPEs:        versToCPEs(unique(versions), signature.Cpe),
			})
		}
	}
	return techs
}
