import type { Signature } from "../_types.js";

export const yawsSignature: Signature = {
  name: "Yaws",
  description:
    "Yaws is a HTTP high performance 1.1 webserver particularly well suited for dynamic-content web applications.",
  cpe: "cpe:/a:yaws:yaws",
  rule: {
    confidence: "high",
    headers: {
      server: "yaws\\s*(\\d+\\.\\d+\\.\\d+)?",
    },
  },
};
