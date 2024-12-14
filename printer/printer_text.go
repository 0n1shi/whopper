package printer

import (
	"fmt"

	"github.com/0n1shi/whopper/analyzer"
)

type TextPrinter struct{}

func NewTextPrinter() *TextPrinter {
	return &TextPrinter{}
}

func (p *TextPrinter) Print(results []*analyzer.Result) {
	fmt.Println()
	for _, result := range results {
		fmt.Println("Name:", result.Name)
		fmt.Println("Description:", result.Description)
		fmt.Println("Versions:")
		for _, version := range result.Versions {
			fmt.Printf("  * %s\n", version)
		}
		fmt.Println("Tags:")
		for _, tag := range result.Tags {
			fmt.Printf("  * %s\n", tag)
		}
		fmt.Println()
	}
}
