import type { Signature } from "../_types.js";
import { nodeJsSignature } from "./node_js.js";
import { vueJsSignature } from "./vue_js.js";

export const nuxtJsSignature: Signature = {
  name: "Nuxt.js",
  description: "Nuxt is a Vue framework for developing modern web applications.",
  rule: {
    confidence: "high",
    urls: ["/_nuxt/"],
    bodies: [
      "<div [^>]*id=[\"']__nuxt[\"']",
      "<script [^>]*>window\\.__NUXT__",
    ],
    javascriptVariables: {
      $nuxt: "",
    },
  },
  impliedSoftwares: [vueJsSignature.name, nodeJsSignature.name],
};
