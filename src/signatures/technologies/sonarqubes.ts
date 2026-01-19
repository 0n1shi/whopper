import type { Signature } from "../_types.js";
import { javaSignature } from "./java.js";

export const sonarqubesSignature: Signature = {
  name: "SonarQubes",
  description: "SonarQube is an open-source platform for the continuous inspection of code quality to perform automatic reviews with static analysis of code to detect bugs, code smells, and security vulnerabilities on 20+ programming languages.",
  rule: {
    confidence: "high",
    bodies: [
      "<link href=\"/css/sonar\\.css\\?v=([\\d.]+)",
      "<title>SonarQube</title>",
      "<meta[^>]+name=[\"']application-name[\"'][^>]+content=[\"']^SonarQubes$",
    ],
    urls: [
      "^/js/bundles/sonar\\.js?v=([\\d.]+)$",
    ],
    javascriptVariables: {
      "SonarMeasures": "",
      "SonarRequest": "",
    },
  },
  impliedSoftwares: [javaSignature.name],
};
