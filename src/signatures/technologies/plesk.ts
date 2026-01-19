import type { Signature } from "../_types.js";

export const pleskSignature: Signature = {
  name: "Plesk",
  description:
    "Plesk is a web hosting and server data centre automation software with a control panel developed for Linux and Windows-based retail hosting service providers.",
  cpe: "cpe:2.3:a:parallels:parallels_plesk_panel:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    headers: {
      "x-powered-by": "^Plesk(?:L|W)in",
      "x-powered-by-plesk": "^Plesk",
    },
    urls: ["common\\.js\\?plesk"],
  },
};
