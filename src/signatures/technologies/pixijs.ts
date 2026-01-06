import type { Signature } from "../_types.js";

export const pixiJsSignature: Signature = {
  name: "PIXIjs",
  description:
    "PIXIjs is a free open-source 2D engine used to make animated websites and HTML5 games.",
  rule: {
    confidence: "high",
    urls: ["pixi(?:\\.min|-legacy)?\\.js$", ".+\\.pixijs\\.com"],
    javascriptVariables: {
      PIXI: "",
      "PIXI.VERSION": "^(.+)$",
      PIXI_WEBWORKER_URL: "",
    },
  },
};
