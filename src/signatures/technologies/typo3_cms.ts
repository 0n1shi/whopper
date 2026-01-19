import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const typo3CmsSignature: Signature = {
  name: "TYPO3 CMS",
  description: "TYPO3 is a free and open-source Web content management system written in PHP.",
  cpe: "cpe:/a:typo3:typo3",
  rule: {
    confidence: "high",
    bodies: [
      "<link[^>]+ href=\"/?typo3(?:conf|temp)/",
      "<img[^>]+ src=\"/?typo3(?:conf|temp)/",
      "<!--\n\tThis website is powered by TYPO3",
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']TYPO3\\s+(?:CMS\\s+)?(?:[\\d.]+)?(?:\\s+CMS)?",
    ],
    urls: [
      "^/?typo3(?:conf|temp)/",
      "/typo3/",
    ],
  },
  impliedSoftwares: [phpSignature.name],
};
