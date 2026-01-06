import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const wpGoogleMapPluginSignature: Signature = {
  name: "WP Google Map Plugin",
  description:
    "WP Google Map Plugin allows you to create google maps shortcodes to display responsive google maps on pages, widgets and custom templates.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/wp-google-map-plugin/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
    javascriptVariables: {
      wpgmp_local: "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
