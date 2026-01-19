import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const tablePressSignature: Signature = {
  name: "TablePress",
  description: "TablePress is a free and open source plugin for the WordPress publishing platform. It enables you to create and manage tables on your website, without any coding knowledge.",
  rule: {
    confidence: "high",
    bodies: [
      "/wp-content/plugins/tablepress/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
