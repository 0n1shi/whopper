import type { Signature } from "../_types.js";
import { salesforceSignature } from "./salesforce.js";

export const salesforceServiceCloudSignature: Signature = {
  name: "Salesforce Service Cloud",
  description: "Salesforce Service Cloud is a customer relationship management (CRM) platform for customer service and support.",
  rule: {
    confidence: "high",
    urls: [
      "service\\.force\\.com",
    ],
    javascriptVariables: {
      "embedded_svc": "",
    },
  },
  impliedSoftwares: [salesforceSignature.name],
};
