import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const wpPageNaviSignature: Signature = {
  name: "WP-PageNavi",
  description:
    "WP-PageNavi is a WordPress plugin which adds a more advanced paging navigation interface to your WordPress blog.",
  rule: {
    confidence: "high",
    bodies: ["/wp-content/plugins/wp-pagenavi/"],
  },
  impliedSoftwares: [wordpressSignature.name],
};
