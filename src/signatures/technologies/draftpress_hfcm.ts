import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const draftpressHfcmSignature: Signature = {
  name: "Draftpress HFCM",
  description: "Header Footer Code Manager by Draftpress is a easy interface to add snippets to the header or footer or above or below the content of your page.",
  rule: {
    confidence: "high",
    bodies: [
      "<!--[^>]*HFCM\\sby\\s99\\sRobots",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
