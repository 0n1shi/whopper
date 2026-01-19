import type { Signature } from "../_types.js";

export const f5BigIpSignature: Signature = {
  name: "F5 BigIP",
  description:
    "F5's BIG-IP is a family of products covering software and hardware designed around application availability, access control, and security solutions.",
  cpe: "cpe:/a:f5:big-ip",
  rule: {
    confidence: "high",
    headers: {
      server: "^big-?ip$",
    },
    cookies: {
      F5_HT_shrinked: ".+",
      F5_ST: ".+",
      F5_fullWT: ".+",
      LastMRH_Session: ".+",
      MRHSHint: ".+",
      MRHSequence: ".+",
      MRHSession: ".+",
      TIN: ".+",
    },
  },
};
