import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const fooGallerySignature: Signature = {
  name: "FooPlugins FooGallery",
  description: "FooPlugins FooGallery is a great image gallery plugin for WordPress.",
  rule: {
    confidence: "high",
    bodies: [
      "/wp-content/plugins/foogallery/.+\\.css(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
    javascriptVariables: {
      FooGallery: "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
