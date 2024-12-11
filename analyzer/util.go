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
