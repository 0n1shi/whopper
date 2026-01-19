import type { Signature } from "../_types.js";

export const yamahaRtSignature: Signature = {
  name: "YAMAHA RT",
  description: "YAMAHA RT is a series of business-grade routes produced by YAMAHA Corporation.",
  rule: {
    confidence: "high",
    headers: {
      "Server": "YAMAHA-RT",
    },
  },
};
