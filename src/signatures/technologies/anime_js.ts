import type { Signature } from "../_types.js";

export const animeJsSignature: Signature = {
  name: "anime.js",
  description:
    "Anime.js (/ˈæn.ə.meɪ/) is a lightweight JavaScript animation library with a simple, yet powerful API.It works with CSS properties, SVG, DOM attributes and JavaScript Objects.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "anime.version": "^([\\d\\.]+)$",
    },
  },
};
