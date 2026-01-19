import type { Signature } from "../_types.js";
import { cfmlSignature } from "./cfml.js";

export const adobeColdfusionSignature: Signature = {
  name: "Adobe ColdFusion",
  cpe: "cpe:/a:adobe:coldfusion",
  rule: {
    confidence: "high",
    headers: {
      "Cookie": "CFTOKEN=",
    },
    bodies: [
      "<!-- START headerTags\\.cfm",
    ],
    urls: [
      "/cfajax/",
      "\\.cfm(?:$|\\?)",
    ],
    javascriptVariables: {
      "_cfEmails": "",
    },
  },
  impliedSoftwares: [cfmlSignature.name],
};
