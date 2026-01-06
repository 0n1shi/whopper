import type { Signature } from "../_types.js";

export const miniServSignature: Signature = {
  name: "MiniServ",
  description: "MiniServ is a lightweight web server bundled with Webmin.",
  rule: {
    confidence: "high",
    headers: {
      Server: "MiniServ/([\\d\\.]+)",
    },
  },
};
