import type { Signature } from "../_types.js";

export const amazonCloudFrontSignature: Signature = {
  name: "Amazon CloudFront",
  description:
    "Amazon CloudFront is a fast content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally with low latency and high transfer speeds.",
  rule: {
    confidence: "high",
    headers: {
      via: "\\(CloudFront\\)$",
      "x-amz-cf-id": "",
    },
  },
};
