import type { Signature } from "../_types.js";

export const nextjsSignature: Signature = {
  name: "Next.js",
  description:
    "Next.js is a React framework for developing single page Javascript applications.",
  cpe: "cpe:/a:vercel:next.js",
  rule: {
    confidence: "high",
    headers: {
      "x-powered-by": "^Next\\.js (\\d+\\.\\d+\\.\\d+)?",
    },
    javascripts: {
      __NEXT_DATA__: "",
      "next.version": "(.+)$",
    },
  },
};
