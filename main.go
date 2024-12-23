package main

import (
	"fmt"
	"log/slog"
	"os"

	"github.com/0n1shi/whopper/crawler"
	"github.com/0n1shi/whopper/inspector"
	"github.com/0n1shi/whopper/printer"
	"github.com/0n1shi/whopper/util"
	"github.com/0n1shi/whopper/whopper"
	"github.com/urfave/cli/v2"
)

var version = "0.1.0"
var author = "@0n1shi"

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
			&cli.StringFlag{
				Name:    "word",
				Usage:   "search for a specific word in the response (url, body, headers) *skips the analysis",
				Value:   "",
				Aliases: []string{"w"},
			},
		},
		Action: func(ctx *cli.Context) error {
			mustBeURL := ctx.Args().First()
			if mustBeURL == "" {
				return cli.ShowAppHelp(ctx)
			}
			if !util.IsValidURL(mustBeURL) {
				return fmt.Errorf("invalid URL: %s", mustBeURL)
			}

			logLevel := ctx.String("level")
			switch logLevel {
			case "debug":
				slog.SetLogLoggerLevel(slog.LevelDebug)
			case "info":
				slog.SetLogLoggerLevel(slog.LevelInfo)
			case "warn":
				slog.SetLogLoggerLevel(slog.LevelWarn)
			case "error":
				slog.SetLogLoggerLevel(slog.LevelError)
			default:
				return fmt.Errorf("invalid log level: %s", logLevel)
			}

			printLogo()
			fmt.Println()

			debugMode := ctx.Bool("debug")
			if debugMode {
				slog.SetLogLoggerLevel(slog.LevelDebug)
				slog.Info("debug mode enabled (log level: debug)")
			}

			p := printer.NewTextPrinter()
			c := crawler.NewRodCrawler()
			var i *inspector.Inspector
			if ctx.String("word") != "" {
				i = inspector.NewInspector(ctx.String("word"))
			}
			w := whopper.NewWhopper(ctx.Bool("debug"), p, c, i)
			return w.Run(mustBeURL)
		},
		CustomAppHelpTemplate: helpTextTemplate,
	}

	if err := app.Run(os.Args); err != nil {
		slog.Error(err.Error())
	}
}

func printLogo() {
	fmt.Println("------------------------------------------")
	fmt.Println(` _    _ _
| |  | | |__   ___  _ __  _ __   ___ _ __
| |/\| | '_ \ / _ \| '_ \| '_ \ / _ \ '__|
\  /\  / | | | (_) | |_) | |_) |  __/ |
 \/  \/|_| |_|\___/| .__/| .__/ \___|_|
                   |_|   |_|              `)
	fmt.Printf("%42s\n", "version "+version)
	fmt.Printf("%42s\n", "developed by "+author)
	fmt.Println("------------------------------------------")
}

const helpTextTemplate = `NAME:
   {{.Name}} - {{.Usage}}

USAGE:
   {{.HelpName}} [global options] {{if .ArgsUsage}}{{.ArgsUsage}}{{end}}
{{if .VisibleFlags}}
GLOBAL OPTIONS:
   {{range .VisibleFlags}}{{.}}
   {{end}}
{{end}}`
