import type { Signature } from "../_types.js";

export const yawsHttpServerSignature: Signature = {
  name: "Yaws HTTP Server",
  description:
    "Yaws is a HTTP high perfomance 1.1 webserver particularly well suited for dynamic-content web applications.",
  cpe: "cpe:/a:yaws:yaws",
  rule: {
    confidence: "high",
    headers: {
      server: "yaws\\s*(\\d+\\.\\d+\\.\\d+)?",
    },
  },
};
