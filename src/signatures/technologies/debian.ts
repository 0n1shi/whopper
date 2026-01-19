import type { Signature } from "../_types.js";

export const debianSignature: Signature = {
  name: "Debian",
  description: "Debian is a free and open-source Linux distribution.",
  cpe: "cpe:2.3:o:debian:debian_linux:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    headers: {
      "Server": "Debian",
      "X-Powered-By": "(?:Debian|dotdeb|(potato|woody|sarge|etch|lenny|squeeze|wheezy|jessie|stretch|buster|sid))",
    },
  },
};
