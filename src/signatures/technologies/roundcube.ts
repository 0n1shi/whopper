import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const roundCubeSignature: Signature = {
  name: "RoundCube",
  description: "RoundCube is free and open-source web-based IMAP email client.",
  cpe: "cpe:2.3:a:roundcube:webmail:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    bodies: [
      "<title>RoundCube",
    ],
    javascriptVariables: {
      "rcmail": "",
      "roundcube": "",
    },
  },
  impliedSoftwares: [phpSignature.name],
};
