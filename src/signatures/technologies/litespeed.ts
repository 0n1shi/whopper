import type { Signature } from "../_types.js";

export const liteSpeedSignature: Signature = {
  name: "LiteSpeed",
  description: "LiteSpeed is a high-scalability web server.",
  cpe: "cpe:2.3:a:litespeedtech:litespeed_web_server:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    headers: {
      "Server": "^LiteSpeed$",
    },
  },
};
