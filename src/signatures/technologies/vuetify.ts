import type { Signature } from "../_types.js";
import { vueJsSignature } from "./vue_js.js";

export const vuetifySignature: Signature = {
  name: "Vuetify",
  description: "Vuetify is a reusable semantic component framework for Vue.js that aims to provide clean, semantic and reusable components.",
  rule: {
    confidence: "high",
    bodies: [
      "vuetify-theme-stylesheet",
      "v-application",
    ],
  },
  impliedSoftwares: [vueJsSignature.name],
};
