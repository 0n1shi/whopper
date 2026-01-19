import type { Signature } from "../_types.js";

export const almaLinuxSignature: Signature = {
  name: "AlmaLinux",
  description: "AlmaLinux is an open-source, community-driven Linux operating system that fills the gap left by the discontinuation of the CentOS Linux stable release.",
  rule: {
    confidence: "high",
    headers: {
      "Server": "AlmaLinux",
    },
  },
};
