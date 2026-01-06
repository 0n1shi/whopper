import type { Signature } from "../_types.js";

export const angularSignature: Signature = {
  name: "Angular",
  description:
    "Angular is a TypeScript-based open-source web application framework led by the Angular Team at Google.",
  cpe: "cpe:/a:angularjs:angular",
  rule: {
    confidence: "high",
    bodies: ["ng-version=\"([\\d\\.]+)\""],
    javascriptVariables: {
      "ng.coreTokens": "",
      "ng.probe": "",
    },
  },
};
