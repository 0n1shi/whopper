import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const mooveGdprConsentSignature: Signature = {
  name: "Moove GDPR Consent",
  description: "Moove GDPR Consent is a GDPR Cookie Compliance plugin for Wordpress.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "moove_frontend_gdpr_scripts": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
