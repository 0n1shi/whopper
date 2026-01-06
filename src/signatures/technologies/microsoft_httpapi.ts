import type { Signature } from "../_types.js";

export const microsoftHttpApiSignature: Signature = {
  name: "Microsoft HTTPAPI",
  description: "Microsoft HTTPAPI is a Windows HTTP Server API implementation.",
  rule: {
    confidence: "high",
    headers: {
      Server: "Microsoft-HTTPAPI(?:/([\\d.]+))?",
    },
  },
};
