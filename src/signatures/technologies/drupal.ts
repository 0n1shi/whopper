import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const drupalSignature: Signature = {
  name: "Drupal",
  description: "Drupal is a free and open-source web content management framework.",
  cpe: "cpe:/a:drupal:drupal",
  rule: {
    confidence: "high",
    headers: {
      Expires: "19 Nov 1978",
      "X-Drupal-Cache": "",
      "X-Generator": "^Drupal(?:\\s([\\d.]+))?",
    },
    bodies: [
      "<(?:link|style)[^>]+\"/sites/(?:default|all)/(?:themes|modules)/",
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']Drupal(?:\\s([\\d.]+))?",
    ],
    urls: ["drupal\\.js"],
    javascriptVariables: {
      Drupal: "",
    },
  },
  impliedSoftwares: [phpSignature.name],
};
