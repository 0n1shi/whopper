package printer

import (
	"fmt"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
)

type TextPrinter struct{}

var _ Printer = &TextPrinter{}

func NewTextPrinter() *TextPrinter {
	return &TextPrinter{}
}

func (p *TextPrinter) Print(techs []*analyzer.Tech, err error) {
	fmt.Println()
	fmt.Printf("[+] Found %d techs\n", len(techs))
	fmt.Println()
	for _, tech := range techs {
		fmt.Printf("[+] %s:", tech.Name)
		fmt.Printf(" %s\n", strings.Join(tech.Versions, ", "))
		fmt.Printf("    > %s\n", tech.Description)
		fmt.Println()
	}
}
