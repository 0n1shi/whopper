import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const smashBalloonInstagramFeedSignature: Signature = {
  name: "Smash Balloon Instagram Feed",
  description: "Instagram Feed displays Instagram posts from your Instagram accounts, either in the same single feed or in multiple different ones. Created by Smash Balloon.",
  rule: {
    confidence: "high",
    bodies: [
      "/wp-content/plugins/instagram-feed/",
    ],
    urls: [
      "/wp-content/plugins/instagram-feed/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
