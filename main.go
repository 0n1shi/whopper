package main

import (
	"fmt"
	"log/slog"
	"os"

	"github.com/0n1shi/whopper/detector"
	"github.com/0n1shi/whopper/util"
	"github.com/urfave/cli/v2"
)

func main() {
	app := &cli.App{
		Name:      "whopper",
		Usage:     "A CLI tool to detect the technology stack used on a website",
		ArgsUsage: "<http(s)://...>",
		Flags: []cli.Flag{
			&cli.BoolFlag{
				Name:  "dump",
				Usage: "dump every response (status, headers, body)",
				Value: false,
				Aliases: []string{"d"},
			},
		},
		Action: func(c *cli.Context) error {
			mustBeURL := c.Args().First()
			if mustBeURL == "" {
				return cli.ShowAppHelp(c)
			}
			if !util.IsValidURL(mustBeURL) {
				return fmt.Errorf("invalid URL: %s", mustBeURL)
			}
			d := detector.NewDetector(c.Bool("dump"))
			return d.Detect(mustBeURL)
		},
		CustomAppHelpTemplate: `NAME:
   {{.Name}} - {{.Usage}}

USAGE:
   {{.HelpName}} [global options] {{if .ArgsUsage}}{{.ArgsUsage}}{{end}}
{{if .VisibleFlags}}
GLOBAL OPTIONS:
   {{range .VisibleFlags}}{{.}}
   {{end}}
{{end}}`,
	}

	if err := app.Run(os.Args); err != nil {
		slog.Error(err.Error())
	}
}
