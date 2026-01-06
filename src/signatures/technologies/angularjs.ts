import type { Signature } from "../_types.js";

export const angularJsSignature: Signature = {
  name: "AngularJS",
  description:
    "AngularJS is a JavaScript-based open-source web application framework led by the Angular Team at Google.",
  cpe: "cpe:2.3:a:angularjs:angular.js:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    urls: [
      "angular[.-]([\\d.]*\\d)[^/]*\\.js",
      "/([\\d.]+(?:-?rc[.\\d]*)*)/angular(?:\\.min)?\\.js",
      "(?!angular\\.io)\\bangular.{0,32}\\.js",
    ],
    bodies: ["<(?:div|html)[^>]+ng-app=", "<ng-app"],
    javascriptVariables: {
      angular: "",
      "angular.version.full": "^(.+)$",
    },
  },
};
