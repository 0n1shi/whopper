import type { Signature } from "../_types.js";

export const ubuntuSignature: Signature = {
  name: "Ubuntu",
  description:
    "Ubuntu is a free and open-source operating system on Linux for the enterprise server, desktop, cloud, and IoT.",
  cpe: "cpe:/o:canonical:ubuntu_linux",
  rule: {
    confidence: "high",
    headers: {
      server: "Ubuntu",
      "x-powered-by": "Ubuntu",
    },
  },
};
