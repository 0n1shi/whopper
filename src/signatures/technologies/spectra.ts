import type { Signature } from "../_types.js";
import { gutenbergSignature } from "./gutenberg.js";
import { wordpressSignature } from "./wordpress.js";

export const spectraSignature: Signature = {
  name: "Spectra",
  description:
    "Spectra is a WordPress plugin that provides a collection of new and enhanced blocks for the Gutenberg editor.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/ultimate-addons-for-gutenberg/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
  },
  impliedSoftwares: [wordpressSignature.name, gutenbergSignature.name],
};
