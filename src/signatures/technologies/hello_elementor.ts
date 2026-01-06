import type { Signature } from "../_types.js";
import { elementorSignature } from "./elementor.js";
import { wordpressSignature } from "./wordpress.js";

export const helloElementorSignature: Signature = {
  name: "Hello Elementor",
  description:
    "Hello Elementor is a WordPress theme built for the Elementor website builder platform. It uses minimal styling and scripts for maximum speed and design freedom.",
  rule: {
    confidence: "high",
    urls: [
      "elementor-hello\\S*\\.css(?:\\?ver=([0-9.]+))?",
      "hello-elementor\\S*\\.css(?:\\?ver=([0-9.]+))?",
    ],
    bodies: ["id=\"hello-elementor\""],
  },
  impliedSoftwares: [wordpressSignature.name, elementorSignature.name],
};
