import type { Signature } from "../_types.js";
import { reactSignature } from "./react.js";

export const wixSignature: Signature = {
  name: "Wix",
  description: "Wix provides cloud-based web development services, allowing users to create HTML5 websites and mobile sites.",
  rule: {
    confidence: "high",
    headers: {
      "X-Wix-Renderer-Server": "",
      "X-Wix-Request-Id": "",
      "X-Wix-Server-Artifact-Id": "",
    },
    cookies: {
      "Domain": "\\.wix\\.com",
    },
    bodies: [
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']Wix\\.com Website Builder",
    ],
    urls: [
      "static\\.parastorage\\.com",
    ],
    javascriptVariables: {
      "wixBiSession": "",
      "wixPerformanceMeasurements": "",
    },
  },
  impliedSoftwares: [reactSignature.name],
};
