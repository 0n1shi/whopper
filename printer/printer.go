package printer

import "github.com/0n1shi/whopper/analyzer"

type Printer interface {
	Print(results []*analyzer.Result, err error)
}
