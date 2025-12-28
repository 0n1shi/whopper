import type { Signature } from "./_types.js";

export const awsElbSignature: Signature = {
  name: "AWS Elastic Load Balancer",
  description:
    "AWS Elastic Load Balancing automatically distributes incoming application traffic across multiple targets, such as Amazon EC2 instances, containers, and IP addresses.",
  rule: {
    confidence: "high",
    headers: {
      server: "^awselb/?(\\d+\\.\\d+)?$",
    },
  },
};
