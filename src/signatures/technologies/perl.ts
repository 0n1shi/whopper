import type { Signature } from "../_types.js";

export const perlSignature: Signature = {
  name: "Perl",
  description:
    "Perl is a family of two high-level, general-purpose, interpreted, dynamic programming languages.",
  cpe: "cpe:/a:perl:perl",
  rule: {
    confidence: "high",
    headers: {
      Server: "\\bPerl\\b(?: ?/?v?([\\d.]+))?",
    },
  },
};
