package printer

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"os"

	"github.com/0n1shi/whopper/analyzer"
)

type JsonPrinter struct{}

var _ Printer = &JsonPrinter{}

func NewJsonPrinter() *JsonPrinter {
	return &JsonPrinter{}
}

type JsonPrinterOutput struct {
	Completed bool               `json:"completed"`
	Error     *string            `json:"error"`
	Results   []*analyzer.Result `json:"results"`
}

func (p *JsonPrinter) Print(results []*analyzer.Result, err error) {
	var errMessage *string
	if err != nil {
		errMessage = new(string)
		*errMessage = err.Error()
	}
	output := JsonPrinterOutput{
		Completed: err == nil,
		Error:     errMessage,
		Results:   results,
	}

	jsonOutput, err := json.Marshal(output)
	if err != nil {
		slog.Error("failed to marshal the output", "error", err)
		return
	}
	fmt.Fprintln(os.Stderr, string(jsonOutput))
}
