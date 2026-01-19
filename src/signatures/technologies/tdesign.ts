import type { Signature } from "../_types.js";

export const tdesignSignature: Signature = {
  name: "TDesign",
  description: "TDesign launched by Tencent contains rich and reusable design component resources, such as color system, text system, motion design, etc.",
  rule: {
    confidence: "high",
    bodies: [
      "t-button__text",
      "t-layout",
    ],
    urls: [
      "tdesign\\.gtimg\\.com/",
    ],
  },
};
