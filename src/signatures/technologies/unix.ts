import type { Signature } from "../_types.js";

export const unixSignature: Signature = {
  name: "UNIX",
  description: "Unix is a family of multitasking, multiuser computer operating systems.",
  rule: {
    confidence: "high",
    headers: {
      server: "Unix",
    },
  },
};
