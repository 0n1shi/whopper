import type { Signature } from "../_types.js";

export const pagekitSignature: Signature = {
  name: "Pagekit",
  cpe: "cpe:/a:pagekit:pagekit",
  rule: {
    confidence: "high",
    bodies: [
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']Pagekit",
    ],
  },
};
