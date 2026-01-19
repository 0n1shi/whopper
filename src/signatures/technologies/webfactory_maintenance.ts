import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const webfactoryMaintenanceSignature: Signature = {
  name: "WebFactory Maintenance",
  description: "WebFactory Maintenance is a WordPress plugin which allows you to create an maintenance page.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+\\/wp\\-content\\/plugins\\/maintenance\\/",
    ],
    javascriptVariables: {
      "mtnc_front_options": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
