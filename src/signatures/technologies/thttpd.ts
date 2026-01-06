import type { Signature } from "../_types.js";

export const thttpdSignature: Signature = {
  name: "thttpd",
  description: "thttpd is a simple, small, portable, fast HTTP server.",
  cpe: "cpe:2.3:a:acme:thttpd:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    headers: {
      Server: "\\bthttpd(?:/([\\d.]+))?",
    },
  },
};
