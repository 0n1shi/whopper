import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const profilePressSignature: Signature = {
  name: "ProfilePress",
  description:
    "ProfilePress is a WordPress registration plugin that lets you create login forms, registration forms, user profiles, and more.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/wp-user-avatar(?:-pro)?/.+frontend\\.min\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
    cookies: {
      ppwp_wp_session: ".*",
    },
    bodies: ["/wp-content/plugins/wp-user-avatar/"],
  },
  impliedSoftwares: [wordpressSignature.name],
};
