import type { Signature } from "../_types.js";

export const liteYoutubeEmbedSignature: Signature = {
  name: "lite-youtube-embed",
  description: "The lite-youtube-embed technique renders the YouTube video inside the IFRAME tag only when the play button in clicked thus improving the core web vitals score of your website.",
  rule: {
    confidence: "high",
    bodies: [
      "lite-youtube",
    ],
  },
};
