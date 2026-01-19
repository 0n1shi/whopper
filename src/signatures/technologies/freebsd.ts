import type { Signature } from "../_types.js";

export const freebsdSignature: Signature = {
  name: "FreeBSD",
  description: "FreeBSD is a free and open-source Unix-like operating system.",
  cpe: "cpe:/o:freebsd:freebsd",
  rule: {
    confidence: "high",
    headers: {
      "Server": "FreeBSD(?: ([\\d.]+))?",
    },
  },
};
