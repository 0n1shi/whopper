import type { Signature } from "../_types.js";

export const apacheTrafficServerSignature: Signature = {
  name: "Apache Traffic Server",
  cpe: "cpe:/a:apache:traffic_server",
  rule: {
    confidence: "high",
    headers: {
      "Server": "ATS/?([\\d.]+)?",
    },
  },
};
