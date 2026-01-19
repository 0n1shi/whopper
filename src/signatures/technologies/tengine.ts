import type { Signature } from "../_types.js";

export const tengineSignature: Signature = {
  name: "Tengine",
  description: "Tengine is a web server which is based on the Nginx HTTP server.",
  rule: {
    confidence: "high",
    headers: {
      "Server": "Tengine",
    },
  },
};
