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

func versToCPEs(vers []string, toCPE func(string) string) []string {
	if len(vers) == 0 {
		cpe := toCPE("")
		if cpe == "" {
			return []string{}
		}
		return []string{cpe + "*"}
	}

	cpes := make([]string, 0, len(vers))
	for _, ver := range vers {
		cpes = append(cpes, toCPE(ver))
	}
	return cpes
}
