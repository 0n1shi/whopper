package analyzer

type Tech struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Versions    []string `json:"versions"`
	CPEs        []string `json:"cpes"`
}
