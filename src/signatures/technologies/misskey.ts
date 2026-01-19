import type { Signature } from "../_types.js";

export const misskeySignature: Signature = {
  name: "Misskey",
  description: "Misskey is a distributed microblogging platform.",
  rule: {
    confidence: "high",
    bodies: [
      "<!-- Thank you for using Misskey! @syuilo -->",
      "<meta[^>]+name=[\"']application-name[\"'][^>]+content=[\"']Misskey",
    ],
  },
};
