import type { Signature } from "../_types.js";

export const webVitalsSignature: Signature = {
  name: "web-vitals",
  description:
    "The web-vitals JavaScript is a tiny, modular library for measuring all the web vitals metrics on real users.",
  rule: {
    confidence: "high",
    urls: ["web-vitals@([\\d.]+)/dist/web-vitals.*\\.js"],
    javascriptVariables: {
      webVitals: "",
    },
  },
};
