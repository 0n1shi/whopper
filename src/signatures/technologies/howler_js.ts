import type { Signature } from "../_types.js";

export const howlerSignature: Signature = {
  name: "Howler.js",
  description: "Howler.js is an audio library with support for the Web Audio API and a fallback mechanism for HTML5 Audio.",
  rule: {
    confidence: "high",
    urls: [
      "howler@([\\d.]+)/dist/howler\\.min\\.js",
      "howler/([\\d.]+)/howler(?:\\.core)?\\.min\\.js",
    ],
    javascriptVariables: {
      "Howler": "",
      "HowlerGlobal": "",
    },
  },
};
