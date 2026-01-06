import type { Signature } from "../_types.js";

export const jettySignature: Signature = {
  name: "Jetty",
  description: "Jetty is a Java HTTP server and servlet container.",
  rule: {
    confidence: "high",
    headers: {
      Server: "Jetty(?:\\(([\\d\\.]*\\d+))?)",
    },
  },
};
