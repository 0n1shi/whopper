import type { Signature } from "../_types.js";

export const dreamWeaverSignature: Signature = {
  name: "DreamWeaver",
  description:
    "Dreamweaver is a development tool for creating, publishing, and managing websites and mobile content.",
  cpe: "cpe:/a:adobe:dreamweaver",
  rule: {
    confidence: "high",
    bodies: [
      "<!--[^>]*(?:InstanceBeginEditable|Dreamweaver([^>]+)target|DWLayoutDefaultTable)",
      "<!-- #BeginTemplate\\s\"[\\d_\\w/]+\\.dwt",
      "MM_preloadImages",
      "MM_showHideLayers",
      "MM_showMenu",
    ],
  },
};
