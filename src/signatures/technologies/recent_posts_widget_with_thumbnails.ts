import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const recentPostsWidgetWithThumbnailsSignature: Signature = {
  name: "Recent Posts Widget With Thumbnails",
  description:
    "Recent Posts Widget With Thumbnails is based on the well-known WordPress default widget 'Recent Posts' and extended to display more informations about the posts.",
  rule: {
    confidence: "high",
    bodies: [
      "/wp-content/plugins/recent-posts-widget-with-thumbnails/.+\\.css(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
