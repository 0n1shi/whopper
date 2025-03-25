package printer

import "github.com/0n1shi/whopper/analyzer"

type Printer interface {
	Print(techs []*analyzer.Tech, err error)
}
