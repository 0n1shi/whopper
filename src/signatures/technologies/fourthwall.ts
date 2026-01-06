import type { Signature } from "../_types.js";

export const fourthwallSignature: Signature = {
  name: "Fourthwall",
  description: "Fourthwall helps to create and launch a branded website.",
  rule: {
    confidence: "high",
    urls: ["\\.fourthwall\\.com"],
    javascriptVariables: {
      FourthwallAnalytics: "",
      fourthwallTheme: "",
    },
  },
};
