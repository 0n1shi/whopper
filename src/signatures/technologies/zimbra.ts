import type { Signature } from "../_types.js";
import { javaSignature } from "./java.js";

export const zimbraSignature: Signature = {
  name: "Zimbra",
  cpe: "cpe:/a:zimbra:zimbra",
  rule: {
    confidence: "high",
    cookies: {
      "ZM_TEST": "true",
    },
  },
  impliedSoftwares: [javaSignature.name],
};
