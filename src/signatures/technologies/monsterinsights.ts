import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const monsterInsightsSignature: Signature = {
  name: "MonsterInsights",
  description: "MonsterInsights is the most popular Google Analytics plugin for WordPress.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/google-analytics-for-wordpress/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
    javascriptVariables: {
      MonsterInsights: "",
      monsterinsights_frontend: "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
