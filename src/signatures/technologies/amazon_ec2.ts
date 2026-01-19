import type { Signature } from "../_types.js";

export const amazonEc2Signature: Signature = {
  name: "Amazon EC2",
  description: "Amazon Elastic Compute Cloud is a part of Amazon.com's cloud-computing platform, Amazon Web Services, that allows users to rent virtual computers on which to run their own computer applications.",
  rule: {
    confidence: "high",
    headers: {
      "Server": "\\(Amazon\\)",
    },
  },
};
