import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const ultimatelysocialSignature: Signature = {
  name: "UltimatelySocial",
  description: "Ultimately Social (Share Buttons & Sharing Icons) is a plugin that allows you to place fancy social media icons and buttons on your WordPress website.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/ultimate-social-media-icons/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
