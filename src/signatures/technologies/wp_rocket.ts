import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const wpRocketSignature: Signature = {
  name: "WP Rocket",
  description: "WP Rocket is a caching and performance optimization plugin to improve the loading speed of WordPress websites.",
  rule: {
    confidence: "high",
    headers: {
      "X-Powered-By": "WP Rocket(?:/([\\d.]+))?",
      "X-Rocket-Nginx-Bypass": "",
    },
    bodies: [
      "<!--[^>]+WP Rocket",
      "wpr-usedcss",
    ],
    urls: [
      "/wp-content/plugins/wp-rocket/",
    ],
    javascriptVariables: {
      "RocketLazyLoadScripts": "",
      "RocketPreloadLinksConfig": "",
      "rocket_lazy": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
