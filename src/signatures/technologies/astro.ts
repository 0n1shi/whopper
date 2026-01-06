import type { Signature } from "../_types.js";

export const astroSignature: Signature = {
  name: "Astro",
  description: "Astro is a new JavaScript-based static site builder.",
  rule: {
    confidence: "high",
    urls: ["/_astro/(?:common|index)(?:-|\\.)[\\d\\w]+\\.css"],
    bodies: [
      "class=\"astro-[\\d\\w]{8,}\"",
      "<astro-root",
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']Astro\\sv([\\d\\.]+)",
    ],
    javascriptVariables: {
      Astro: "",
    },
  },
};
