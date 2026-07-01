import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

// CHANGELOG.txt starts with the newest release line, e.g. "Drupal 7.35, 2015-03-18".
// Requiring the trailing date guards against matching unrelated "Drupal X" prose.
const drupalChangelogVersionRegexes = [
  "Drupal\\s+(\\d+\\.\\d+(?:\\.\\d+)?(?:-[a-z0-9.]+)?),\\s*20\\d\\d",
];

export const drupalSignature: Signature = {
  name: "Drupal",
  description: "Drupal is a free and open-source web content management framework.",
  cpe: "cpe:/a:drupal:drupal",
  rule: {
    confidence: "high",
    headers: {
      Expires: "19 Nov 1978",
      "X-Drupal-Cache": "",
      "X-Drupal-Dynamic-Cache": "",
      "X-Generator": "^Drupal(?:\\s([\\d.]+))?",
    },
    bodies: [
      "<(?:link|style)[^>]+\"/sites/(?:default|all)/(?:themes|modules)/",
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']Drupal(?:\\s([\\d.]+))?",
      "Drupal\\.settings",
      "data-drupal-selector=[\"']drupal-settings-json",
    ],
    urls: ["drupal\\.js"],
    javascriptVariables: {
      Drupal: "",
      drupalSettings: "",
    },
  },
  activeRules: [
    { path: "/CHANGELOG.txt", bodyRegexes: drupalChangelogVersionRegexes },
    { path: "/core/CHANGELOG.txt", bodyRegexes: drupalChangelogVersionRegexes },
    {
      path: "/core/install.php",
      bodyRegexes: ["<span class=[\"']site-version[\"']>([0-9.a-z-]+)</span>"],
    },
  ],
  impliedSoftwares: [phpSignature.name],
};
