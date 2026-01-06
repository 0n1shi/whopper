import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const complianzSignature: Signature = {
  name: "Complianz",
  description:
    "Complianz is a GDPR/CCPA Cookie Consent plugin that supports GDPR, DSGVO, CCPA and PIPEDA with a conditional Cookie Notice and customized Cookie Policy based on the results of the built-in Cookie Scan.",
  rule: {
    confidence: "high",
    urls: ["wp-content/plugins/complianz-gdpr-premium"],
    javascriptVariables: {
      "complianz.version": "([\\d.]+)",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
