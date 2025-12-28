import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const slickSignature: Signature = {
  name: "Slick",
  description:
    "Slick is a popular, fully responsive jQuery plugin used for creating versatile and customizable carousels and content sliders.",
  rule: {
    confidence: "high",
    urls: ["(\\d+\\.\\d+\\.\\d+)?/slick[/.-]?"],
    bodies: ["(\\d+\\.\\d+\\.\\d+)[\\s\\S]*?slick-theme\\.css"],
  },
  impliedSoftwares: [jquerySignature.name],
};
