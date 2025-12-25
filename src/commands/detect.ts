import { Command } from "commander";
import { openPage } from "../browser/index.js";
import { detect } from "../detector/index.js";
import { signatures } from "../signatures/index.js";

export const detectCommand = (): Command => {
  return new Command("detect")
    .argument("<url>", "URL of the website to analyze")
    .description("Detects technologies used on the specified website URL.")
    .action(async (url: string) => {
      const context = await openPage(url);
      const detections = detect(context, signatures);

      if (detections.length === 0) {
        console.log("No technologies detected.");
      }
      for (const detection of detections) {
        console.log(
          `Detected: ${detection.name} (Confidence: ${detection.confidence})`,
        );
        for (const evidence of detection.evidences) {
          console.log(`  - [${evidence.type}] ${evidence.value}`);
        }
      }
      await context.browser.close();
    });
};
