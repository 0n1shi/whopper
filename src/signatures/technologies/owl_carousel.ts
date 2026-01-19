import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const owlCarouselSignature: Signature = {
  name: "OWL Carousel",
  description:
    "OWL Carousel is an enabled jQuery plugin that lets you create responsive carousel sliders.",
  rule: {
    confidence: "high",
    urls: ["owl\\.carousel.*\\.js"],
    bodies: [
      "<link [^>]*href=[\"'][^\"']+owl\\.carousel(?:\\.min)?\\.css",
    ],
  },
  impliedSoftwares: [jquerySignature.name],
};
