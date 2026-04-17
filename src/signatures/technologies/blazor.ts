import type { Signature } from "../_types.js";
import { aspNetSignature } from "./asp_net.js";

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
  impliedSoftwares: [aspNetSignature.name],
};
