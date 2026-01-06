import type { Signature } from "../_types.js";
import { squarespaceSignature } from "./squarespace.js";

export const squarespaceCommerceSignature: Signature = {
  name: "Squarespace Commerce",
  description:
    "Squarespace Commerce is an ecommerce platform designed to facilitate the creation of websites and online stores, with domain registration and web hosting included.",
  rule: {
    confidence: "high",
    headers: {
      server: "Squarespace",
    },
    urls: [
      "assets\\.squarespace\\.\\w+/universal/scripts-compressed/commerce-\\w+-min\\.[\\w+\\-]+\\.js",
    ],
    javascriptVariables: {
      "SQUARESPACE_ROLLUPS.squarespace-commerce": "",
      "Static.SQUARESPACE_CONTEXT.templateVersion": "^(\\d(?:\\.\\d)?)$",
    },
  },
  impliedSoftwares: [squarespaceSignature.name],
};
