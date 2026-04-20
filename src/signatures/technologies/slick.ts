import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const slickSignature: Signature = {
  name: "Slick",
  description:
    "Slick is a popular, fully responsive jQuery plugin used for creating versatile and customizable carousels and content sliders.",
  rule: {
    confidence: "high",
    urls: [
      "slick(?:-carousel)?[/@](\\d+\\.\\d+\\.\\d+)[^\"'\\s]*?slick(?:\\.min)?\\.js",
      "/slick(?:\\.min)?\\.js",
    ],
    bodies: ["slick[^\"'\\s<>]*?(\\d+\\.\\d+\\.\\d+)[^\"'\\s<>]*?slick-theme\\.css"],
  },
  impliedSoftwares: [jquerySignature.name],
};
