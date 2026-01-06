import type { Signature } from "../_types.js";

export const lineLoginSignature: Signature = {
  name: "LINE Login",
  description:
    "LINE Login is an API that allows you to implement a login function into your services, regardless of whether they are web apps or native apps.",
  rule: {
    confidence: "high",
    bodies: ["access\\.line\\.me/"],
    javascriptVariables: {
      "Constants.authorization_request_url":
        "access\\.line\\.me/oauth2/v([\\d\\.]+)/",
    },
  },
};
