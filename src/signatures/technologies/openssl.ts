import type { Signature } from "../_types.js";

export const openSslSignature: Signature = {
  name: "OpenSSL",
  description:
    "OpenSSL is a software library for applications that secure communications over computer networks against eavesdropping or need to identify the party at the other end.",
  cpe: "cpe:/a:openssl:openssl",
  rule: {
    confidence: "high",
    headers: {
      Server: "OpenSSL(?:/([\\d.]+[a-z]?))?",
    },
  },
};
