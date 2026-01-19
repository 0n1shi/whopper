import type { Signature } from "../_types.js";

export const linkedinSignInSignature: Signature = {
  name: "Linkedin Sign-in",
  description: "Linkedin Sign-In is an authentication system that reduces the burden of login for users, by enabling them to sign in with their Linkedin account.",
  rule: {
    confidence: "high",
    urls: [
      "platform\\.linkedin\\.com/(?:.*)?in\\.js(?:\\?version)?([\\d.]+)?",
    ],
    javascriptVariables: {
      "OnLinkedInAuth": "",
      "onLinkedInLoad": "",
    },
  },
};
