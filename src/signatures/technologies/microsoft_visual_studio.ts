import type { Signature } from "../_types.js";

export const microsoftVisualStudioSignature: Signature = {
  name: "Microsoft Visual Studio",
  description: "Microsoft Visual Studio is an integrated development environment from Microsoft.",
  rule: {
    confidence: "high",
    bodies: [
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']^Microsoft\\sVisual\\sStudio",
    ],
  },
};
