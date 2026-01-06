import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const diviSignature: Signature = {
  name: "Divi",
  description:
    "Divi is a WordPress Theme and standalone WordPress plugin from Elegant themes that allows users to build websites using the visual drag-and-drop Divi page builder.",
  rule: {
    confidence: "high",
    urls: ["Divi/js/custom\\.(?:min|unified)\\.js\\?ver=([\\d.]+)"],
    bodies: [
      "divi-style-parent-inline-inline-css[\\s\\S]*?Version\\:\\s([\\d\\.]+)",
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']Divi(?:\\sv\\.([\\d\\.]+))?",
    ],
    javascriptVariables: {
      DIVI: "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
