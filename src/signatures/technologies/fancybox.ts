import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const fancyBoxSignature: Signature = {
  name: "FancyBox",
  description:
    "FancyBox is a tool for displaying images, html content and multi-media in a Mac-style 'lightbox' that floats overtop of web page.",
  rule: {
    confidence: "high",
    urls: [
      "jquery\\.fancybox(?:\\.pack|\\.min)?\\.js(?:\\?v=([\\d.]+))?$",
    ],
    javascriptVariables: {
      "$.fancybox.version": "(.+)",
      "Fancybox.version": "(.+)",
      "jQuery.fancybox.version": "(.+)",
    },
  },
  impliedSoftwares: [jquerySignature.name],
};
