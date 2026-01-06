import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const mediaWikiSignature: Signature = {
  name: "MediaWiki",
  description: "MediaWiki is a free and open-source wiki engine.",
  cpe: "cpe:2.3:a:mediawiki:mediawiki:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    bodies: [
      "<body[^>]+class=\"mediawiki\"",
      "Powered by MediaWiki",
      "Special:WhatLinksHere",
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']MediaWiki ?(.+)",
    ],
    javascriptVariables: {
      "mw.util.toggleToc": "",
      wgTitle: "",
      wgVersion: "^(.+)$",
    },
  },
  impliedSoftwares: [phpSignature.name],
};
