import type { Signature } from "../_types.js";

export const googlePageSpeedSignature: Signature = {
  name: "Google PageSpeed",
  description:
    "Google PageSpeed is a family of tools designed to help websites performance optimisations.",
  rule: {
    confidence: "high",
    headers: {
      "X-Mod-Pagespeed": "([\\d.]+)",
      "X-Page-Speed": "(.+)",
    },
  },
};
