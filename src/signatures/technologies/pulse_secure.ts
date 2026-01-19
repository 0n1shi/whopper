import type { Signature } from "../_types.js";

export const pulseSecureSignature: Signature = {
  name: "Pulse Secure",
  description: "Pulse Secure allows to deploy VPNs to securely to your internal resources.",
  cpe: "cpe:/a:pulsesecure:pulse_connect_secure",
  rule: {
    confidence: "high",
    cookies: {
      "DSSIGNIN": "",
    },
    urls: [
      "/dana-na/auth/",
    ],
  },
};
