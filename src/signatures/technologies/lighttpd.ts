import type { Signature } from "../_types.js";

export const lighttpdSignature: Signature = {
  name: "lighttpd",
  description: "Lighttpd is an open-source web server optimised for speed.",
  rule: {
    confidence: "high",
    headers: {
      Server: "(?:L|l)ight(?:y)?(?:tpd)?(?:/([\\d\\.]+))?",
    },
  },
};
