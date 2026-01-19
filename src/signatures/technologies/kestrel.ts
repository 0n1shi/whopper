import type { Signature } from "../_types.js";
import { microsoftAspSignature } from "./microsoft_asp.js";

export const kestrelSignature: Signature = {
  name: "Kestrel",
  description: "Kestrel is a cross-platform web server for ASP.NET Core.",
  rule: {
    confidence: "high",
    headers: {
      "Server": "^Kestrel",
    },
  },
  impliedSoftwares: [microsoftAspSignature.name],
};
