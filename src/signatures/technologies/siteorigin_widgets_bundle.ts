import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const siteOriginWidgetsBundleSignature: Signature = {
  name: "SiteOrigin Widgets Bundle",
  description:
    "SiteOrigin Widgets Bundle is a WordPress plugin that gives you all the elements you need to build modern, responsive, and engaging website pages.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/so-widgets-bundle/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
    bodies: ["/wp-content/plugins/so-widgets-bundle/"],
  },
  impliedSoftwares: [wordpressSignature.name],
};
