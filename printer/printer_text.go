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

func (p *TextPrinter) Print(results []*analyzer.Result, err error) {
	fmt.Println()
	for _, result := range results {
		fmt.Printf("[+] %s:", result.Name)
		fmt.Printf(" %s\n", strings.Join(result.Versions, ", "))
		fmt.Printf("    > %s\n", result.Description)
		fmt.Println()
	}
}
