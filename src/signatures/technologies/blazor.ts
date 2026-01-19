import type { Signature } from "../_types.js";
import { microsoftAspSignature } from "./microsoft_asp.js";

export const blazorSignature: Signature = {
  name: "Blazor",
  rule: {
    confidence: "high",
    urls: [
      "blazor\\.server\\.js",
      "blazor\\.host\\.min\\.js",
      "blazor\\.webassembly\\.js",
    ],
  },
  impliedSoftwares: [microsoftAspSignature.name],
};
