import type { Signature } from "../_types.js";

export const browserUpdateOrgSignature: Signature = {
  name: "Browser-Update.org",
  description:
    "Browser-update.org is a tool to unobtrusively notify visitors that they should update their web browser in order to use your website.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "$bu_.version": "^([\\d\\.]+)$",
      "$bu_getBrowser": "",
    },
  },
};
