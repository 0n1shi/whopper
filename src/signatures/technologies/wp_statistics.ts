import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const wpStatisticsSignature: Signature = {
  name: "WP-Statistics",
  description: "WP-Statistics is a WordPress plugin which allows you to know your website statistics.",
  rule: {
    confidence: "high",
    bodies: [
      "<!-- Analytics by WP-Statistics v([\\d\\.]+)",
      "href[^>]+\\/wp\\-content\\/plugins\\/wp\\-statistics\\/",
    ],
    javascriptVariables: {
      "WP_Statistics_http": "",
      "wps_statistics_object": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
