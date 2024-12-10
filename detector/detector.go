package detector

import (
	"fmt"
	"time"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
	"github.com/go-rod/rod/lib/proto"
)

func Detect(url string) error {
	fmt.Printf("Detecting technology stack for %s...\n", url)

	debugUrl := launcher.New().Headless(true).MustLaunch()
	fmt.Printf("Debug URL: %s\n", debugUrl)

	fmt.Println("Connecting to browser...")
	browser := rod.New().ControlURL(debugUrl).MustConnect()
	defer browser.MustClose()

	receivedResponses := []*proto.NetworkResponseReceived{}
	page := browser.MustPage()
	go page.EachEvent(func(e *proto.NetworkResponseReceived) {
		fmt.Printf("Response URL: %s [%d]\n", e.Response.URL, e.Response.Status)
		receivedResponses = append(receivedResponses, e)
	})()

	fmt.Println("Navigating to URL...")
	page.MustNavigate(url)
	page.MustWaitLoad()

	time.Sleep(1 * time.Second) // Wait for all events to be processed

	fmt.Printf("Received %d responses\n", len(receivedResponses))

	fmt.Println("Closing browser...")
	return nil
}
