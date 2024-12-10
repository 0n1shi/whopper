package main

import (
	"fmt"
	"os"

	"github.com/0n1shi/whopper/detector"
	"github.com/0n1shi/whopper/util"
	"github.com/urfave/cli/v2"
)

func main() {
	app := &cli.App{
		Name:  "whopper",
		Usage: "A CLI tool to detect the technology stack used on a website",
		Action: func(c *cli.Context) error {
			mustBeURL := c.Args().First()
			if mustBeURL == "" {
				return fmt.Errorf("URL is required")
			}
			if !util.IsValidURL(mustBeURL) {
				return fmt.Errorf("Invalid URL")
			}
			return detector.Detect(mustBeURL)
		},
	}

	if err := app.Run(os.Args); err != nil {
		fmt.Println(err)
	}
}
