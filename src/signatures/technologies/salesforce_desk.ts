import type { Signature } from "../_types.js";

export const salesforceDeskSignature: Signature = {
  name: "Salesforce Desk",
  description: "Salesforce Desk(Desk.com) is software as a service (SaaS) tool on the help desk.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+\\/s\\/sfsites\\/",
    ],
    urls: [
      "^/s/sfsites/auraFW/",
    ],
  },
};
