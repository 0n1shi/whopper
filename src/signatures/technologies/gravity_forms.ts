import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const gravityFormsSignature: Signature = {
  name: "Gravity Forms",
  description: "Gravity Forms is a form builder plugin for WordPress.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/gravityforms/js/[^/]+\\.js\\?ver=([\\d.]+)$",
    ],
    bodies: [
      "gform_wrapper",
      "gform_body",
      "gform_fields",
      "wp-content/plugins/gravityforms/css/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
