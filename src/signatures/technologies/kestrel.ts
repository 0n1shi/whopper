import type { Signature } from "../_types.js";
import { aspNetSignature } from "./asp_net.js";

export const kestrelSignature: Signature = {
  name: "Kestrel",
  description: "Kestrel is a cross-platform web server for ASP.NET Core.",
  rule: {
    confidence: "high",
    headers: {
      "Server": "^Kestrel",
    },
  },
  impliedSoftwares: [aspNetSignature.name],
};
