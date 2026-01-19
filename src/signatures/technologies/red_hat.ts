import type { Signature } from "../_types.js";

export const redHatSignature: Signature = {
  name: "Red Hat",
  description: "Red Hat is an open-source Linux operating system.",
  cpe: "cpe:/o:redhat:linux",
  rule: {
    confidence: "high",
    headers: {
      "Server": "Red Hat",
      "X-Powered-By": "Red Hat",
    },
  },
};
