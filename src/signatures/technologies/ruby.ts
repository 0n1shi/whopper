import type { Signature } from "../_types.js";

export const rubySignature: Signature = {
  name: "Ruby",
  description: "Ruby is an open-source object-oriented programming language.",
  cpe: "cpe:/a:ruby-lang:ruby",
  rule: {
    confidence: "high",
    headers: {
      server: "(?:Mongrel|WEBrick|Ruby)",
    },
  },
};
