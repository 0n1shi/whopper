import type { Signature } from "../_types.js";

export const salesforceSignature: Signature = {
  name: "Salesforce",
  description: "Salesforce is a cloud computing service software (SaaS) that specializes in customer relationship management (CRM).",
  cpe: "cpe:2.3:a:salesforce:*:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    cookies: {
      "com.salesforce": "",
    },
    bodies: [
      "brandQuaternaryFgrs",
    ],
    javascriptVariables: {
      "SFDCApp": "",
      "SFDCCmp": "",
      "SFDCPage": "",
      "SFDCSessionVars": "",
    },
  },
};
