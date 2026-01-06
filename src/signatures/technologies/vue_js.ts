import type { Signature } from "../_types.js";

export const vueJsSignature: Signature = {
  name: "Vue.js",
  description:
    "Vue.js is an open-source model-view-viewmodel JavaScript framework for building user interfaces and single-page applications.",
  rule: {
    confidence: "high",
    urls: [
      "vue[.-]([\\d.]*\\d)[^/]*\\.js",
      "(?:/([\\d.]+))?/vue(?:\\.min)?\\.js",
    ],
    bodies: ["<[^>]+\\sdata-v(?:ue)?-", "vue-app"],
    javascriptVariables: {
      Vue: "",
      "Vue.version": "(.+)",
      VueRoot: "",
      __VUE_HOT_MAP__: "",
      __VUE__: "",
      vueDLL: "",
    },
  },
};
