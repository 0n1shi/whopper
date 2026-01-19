import type { Signature } from "../_types.js";

export const facebookLoginSignature: Signature = {
  name: "Facebook Login",
  description:
    "Facebook Login is a way for people to create accounts and log into your app across multiple platforms.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "FB.getLoginStatus": "",
    },
  },
};
