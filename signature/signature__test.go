package signature

import (
	"testing"
)

func TestSignatures(t *testing.T) {
	for _, s := range Signatures {
		// Check if the signature has at least one detect pattern
		if len(s.DetectPattern.URLs) == 0 && len(s.DetectPattern.Bodies) == 0 && len(s.DetectPattern.Headers) == 0 && len(s.DetectPattern.Cookies) == 0 {
			t.Errorf("Signature %s has no detect pattern", s.Name)
		}
	}
}
