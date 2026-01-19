import type { Signature } from "../_types.js";

export const googleSignInSignature: Signature = {
  name: "Google Sign-in",
  description: "Google Sign-In is a secure authentication system that reduces the burden of login for users by enabling them to sign in with their Google account.",
  rule: {
    confidence: "high",
    bodies: [
      "accounts\\.google\\.com/o/oauth2",
      "<meta[^>]+name=[\"']google-signin-client_id[\"']",
      "<meta[^>]+name=[\"']google-signin-scope[\"']",
    ],
    urls: [
      "accounts\\.google\\.com/gsi/client",
    ],
  },
};
