import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const exactMetricsSignature: Signature = {
  name: "ExactMetrics",
  description:
    "ExactMetrics (formerly Google Analytics Dashboard for WP) plugin helps you properly setup all the powerful Google Analytics tracking features without writing any code or hiring a developer.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/google-analytics-dashboard-for-wp/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
    javascriptVariables: {
      ExactMetrics: "",
      exactmetrics_frontend: "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
