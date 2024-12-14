package main

import (
	"fmt"
	"log/slog"
	"os"

	"github.com/0n1shi/whopper/printer"
	"github.com/0n1shi/whopper/util"
	"github.com/0n1shi/whopper/whopper"
	"github.com/urfave/cli/v2"
)

func main() {
	app := &cli.App{
		Name:      "whopper",
		Usage:     "A CLI tool to detect the technology stack used on a website",
		ArgsUsage: "<http(s)://...>",
		Flags: []cli.Flag{
			&cli.BoolFlag{
				Name:    "debug",
				Usage:   "debug mode",
				Value:   false,
				Aliases: []string{"d"},
			},
			&cli.StringFlag{
				Name:    "level",
				Usage:   "log level (debug | info | warn | error)",
				Value:   "info",
				Aliases: []string{"l"},
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

			logLevel := c.String("level")
			switch logLevel {
			case "debug":
				slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
					Level: slog.LevelDebug,
				})))
			case "info":
				slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
					Level: slog.LevelInfo,
				})))
			case "warn":
				slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
					Level: slog.LevelWarn,
				})))
			case "error":
				slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
					Level: slog.LevelError,
				})))
			default:
				return fmt.Errorf("invalid log level: %s", logLevel)
			}

			debugMode := c.Bool("debug")
			if debugMode {
				slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
					Level: slog.LevelDebug,
				})))
				slog.Info("debug mode enabled (log level: debug)")
			}

			printer := printer.NewTextPrinter()
			w := whopper.NewWhopper(c.Bool("debug"), printer)
			return w.Run(mustBeURL)
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
