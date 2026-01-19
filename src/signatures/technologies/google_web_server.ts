import type { Signature } from "../_types.js";

export const googleWebServerSignature: Signature = {
  name: "Google Web Server",
  cpe: "cpe:/a:google:web_server",
  rule: {
    confidence: "high",
    headers: {
      "Server": "gws",
    },
  },
};
