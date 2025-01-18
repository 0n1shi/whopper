package analyzer

func unique(list []string) []string {
	seen := map[string]struct{}{}
	uniq := []string{}
	for _, s := range list {
		if _, ok := seen[s]; ok {
			continue
		}
		seen[s] = struct{}{}
		uniq = append(uniq, s)
	}
	return uniq
}

func verToCPE(ver string, cpeBase string) string {
	if ver == "" {
		if cpeBase == "" {
			return ""
		}
		return cpeBase + ":*"
	}
	return cpeBase + ":" + ver
}

func versToCPEs(vers []string, cpeBase string) []string {
	cpes := []string{}
	for _, ver := range vers {
		cpes = append(cpes, verToCPE(ver, cpeBase))
	}
	if len(cpes) == 0 {
		cpes = append(cpes, verToCPE("", cpeBase))
	}
	return cpes
}
