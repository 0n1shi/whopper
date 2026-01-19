import type { Signature } from "../_types.js";

export const scrollrevealSignature: Signature = {
  name: "scrollreveal",
  rule: {
    confidence: "high",
    bodies: [
      "<[^>]+data-sr(?:-id)",
    ],
    urls: [
      "scrollreveal(?:\\.min)(?:\\.js)",
    ],
  },
};
