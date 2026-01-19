import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const popupMakerSignature: Signature = {
  name: "Popup Maker",
  description: "Popup Maker is a plugin that lets you create popup windows for your WordPress website.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/popup-maker/(?:.+site(?:\\.min)?\\.js\\?.+ver=(\\d+(?:\\.\\d+)+))?",
    ],
    javascriptVariables: {
      "pum_popups": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
