import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const siteOriginPageBuilderSignature: Signature = {
  name: "SiteOrigin Page Builder",
  description:
    "Page Builder by SiteOrigin makes it easy to build responsive grid-based page content that adapts to mobile devices with pixel perfect accuracy.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/siteorigin-panels/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
