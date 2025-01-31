package main

import (
	"fmt"
	"log/slog"
	"net/url"
	"os"
	"strconv"

	"github.com/0n1shi/whopper/crawler"
	"github.com/0n1shi/whopper/inspector"
	"github.com/0n1shi/whopper/printer"
	"github.com/0n1shi/whopper/whopper"
	"github.com/urfave/cli/v2"
)

const version = "v0.5.0"

func main() {
	slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo})))
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
			&cli.BoolFlag{
				Name:    "version",
				Usage:   "print the version",
				Value:   false,
				Aliases: []string{"v"},
			},
			&cli.BoolFlag{
				Name:    "json",
				Usage:   "output the result in JSON format",
				Value:   false,
				Aliases: []string{"j"},
			},
			&cli.UintFlag{
				Name:    "timeout",
				Usage:   "timeout in seconds",
				Value:   10,
				Aliases: []string{"t"},
			},
			&cli.StringFlag{
				Name:    "user-agent",
				Usage:   "set the user agent",
				Value:   "",
				Aliases: []string{"u"},
			},
		},
		Action: func(ctx *cli.Context) error {
			if ctx.Bool("version") {
				fmt.Println(version)
				return nil
			}

			mustBeURL := ctx.Args().First()
			if mustBeURL == "" {
				return cli.ShowAppHelp(ctx)
			}
			if !isValidURL(mustBeURL) {
				return fmt.Errorf("invalid URL: %s", mustBeURL)
			}

			logLevel := ctx.String("level")
			switch logLevel {
			case "debug":
				slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelDebug})))
			case "info":
				slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo})))
			case "warn":
				slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelWarn})))
			case "error":
				slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelError})))
			default:
				return fmt.Errorf("invalid log level: %s", logLevel)
			}

			printLogo()

			debugMode := ctx.Bool("debug")
			if debugMode {
				slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelDebug})))
				slog.Info("debug mode enabled", "log level", "debug")
			}

			inspectors := []inspector.Inspector{}
			if ctx.String("word") != "" {
				inspectors = append(inspectors, inspector.NewWordInspector(ctx.String("word")))
			}

			var p printer.Printer
			if ctx.Bool("json") {
				p = printer.NewJsonPrinter()
			} else {
				p = printer.NewTextPrinter()
			}

			c := crawler.NewRodCrawler()
			crawlerTimeout := ctx.Uint("timeout")
			c.SetTimeout(crawlerTimeout)
			slog.Info("set timeout to crawler", "timeout", strconv.Itoa(int(crawlerTimeout))+"s")
			if ctx.String("user-agent") != "" {
				c.SetUserAgent(ctx.String("user-agent"))
				slog.Info("set user agent to crawler", "user agent", ctx.String("user-agent"))
			}
			w := whopper.NewWhopper(ctx.Bool("debug"), p, c, inspectors, mustBeURL)
			return w.Run()
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
	fmt.Println("------------------------------------------")
	fmt.Println()
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

func isValidURL(str string) bool {
	_, err := url.ParseRequestURI(str)
	return err == nil
}
