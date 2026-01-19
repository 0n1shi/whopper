import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const embedplusSignature: Signature = {
  name: "EmbedPlus",
  description: "EmbedPlus is a WordPress plugin for YouTube allows you to embed gallery, channel, playlist, or even live stream on your webpage.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/youtube-embed-plus(?:-pro)?/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
