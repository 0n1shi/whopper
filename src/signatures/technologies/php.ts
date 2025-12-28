import type { Signature } from "../_types.js";

export const phpSignature: Signature = {
  name: "PHP",
  description:
    "PHP is a popular general-purpose scripting language that is especially suited to web development.",
  cpe: "cpe:/a:php:php",
  rule: {
    confidence: "high",
    headers: {
      server: "php/?(\\d+\\.\\d+\\.\\d+)?",
      "x-powered-by": "php/?(\\d+\\.\\d+\\.\\d+)?",
    },
    cookies: {
      PHPSESSID: ".+",
    },
  },
};

