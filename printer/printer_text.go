package printer

import (
	"fmt"
	"strings"

	"github.com/0n1shi/whopper/analyzer"
)

type TextPrinter struct{}

func NewTextPrinter() *TextPrinter {
	return &TextPrinter{}
}

func (p *TextPrinter) Print(results []*analyzer.Result) {
	fmt.Println()
	for _, result := range results {
		fmt.Print("[+] ", result.Name)
		fmt.Printf(" %s\n", strings.Join(result.Versions, ", "))
		fmt.Println("   ", result.Description)
		fmt.Printf("    [%s]\n", strings.Join(result.Tags, "], ["))
		fmt.Println()
	}
}
