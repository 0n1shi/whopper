import type { Signature } from "../_types.js";

export const envoySignature: Signature = {
  name: "Envoy",
  description:
    "Envoy is an open-source edge and service proxy, designed for cloud-native applications.",
  cpe: "cpe:/a:envoyproxy:envoy",
  rule: {
    confidence: "high",
    headers: {
      server: "^envoy$",
      "x-envoy-upstream-service-time": "",
    },
  },
};
