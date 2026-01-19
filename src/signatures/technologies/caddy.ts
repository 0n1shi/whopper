import type { Signature } from "../_types.js";

export const caddySignature: Signature = {
  name: "Caddy",
  cpe: "cpe:/a:caddyserver:caddy",
  rule: {
    confidence: "high",
    headers: {
      "Server": "^Caddy$",
    },
  },
};
