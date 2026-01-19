import type { Signature } from "../_types.js";

export const microsoftWordSignature: Signature = {
  name: "Microsoft Word",
  description: "MS Word is a word-processing program used primarily for creating documents.",
  cpe: "cpe:/a:microsoft:word",
  rule: {
    confidence: "high",
    bodies: [
      "(?:<html [^>]*xmlns:w=\"urn:schemas-microsoft-com:office:word\"|<w:WordDocument>|<div [^>]*class=\"?WordSection1[\" >]|<style[^>]*>[^>]*@page WordSection1)",
      "<meta[^>]+name=[\"']ProgId[\"'][^>]+content=[\"']^Word\\.",
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']Microsoft Word( [\\d.]+)?",
    ],
  },
};
