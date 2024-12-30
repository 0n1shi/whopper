package printer

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"os"

	"github.com/0n1shi/whopper/analyzer"
)

type JsonPrinter struct{}

func NewJsonPrinter() *JsonPrinter {
	return &JsonPrinter{}
}

type JsonPrinterOutput struct {
	Results []*analyzer.Result `json:"results"`
}

func (p *JsonPrinter) Print(results []*analyzer.Result) {
	output := JsonPrinterOutput{
		Results: results,
	}

	jsonOutput, err := json.Marshal(output)
	if err != nil {
		slog.Error("failed to marshal the output", "error", err)
		return
	}
	fmt.Fprintln(os.Stderr, string(jsonOutput))
}
