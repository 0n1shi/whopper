import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const joomlaSignature: Signature = {
  name: "Joomla",
  description: "Joomla is a free and open-source content management system for publishing web content.",
  cpe: "cpe:/a:joomla:joomla",
  rule: {
    confidence: "high",
    headers: {
      "X-Content-Encoded-By": "Joomla! ([\\d.]+)",
    },
    bodies: [
      "(?:<div[^>]+id=\"wrapper_r\"|<(?:link|script)[^>]+(?:feed|components)/com_|<table[^>]+class=\"pill)",
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']Joomla!(?: ([\\d.]+))?",
    ],
    urls: [
      "option=com_",
    ],
    javascriptVariables: {
      "Joomla": "",
      "jcomments": "",
    },
  },
  impliedSoftwares: [phpSignature.name],
};
