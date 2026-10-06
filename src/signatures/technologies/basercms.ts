import type { Signature } from "../_types.js";
import { cakePhpSignature } from "./cakephp.js";
import { phpSignature } from "./php.js";

// baserCMS is a Japanese CMS built on CakePHP. Detection only confirms that
// the site runs baserCMS; the version is not exposed by any of these markers.
export const baserCmsSignature: Signature = {
  name: "baserCMS",
  description:
    "baserCMS is an open-source content management system developed in Japan and built on the CakePHP framework.",
  cpe: "cpe:/a:basercms:basercms",
  runtime: "server",
  rule: {
    confidence: "high",
    cookies: {
      // Default session cookie name (BaserCore config/setting.php).
      BASERCMS: "",
    },
    bodies: [
      // Emitted by BcBaserHelper when BcApp.outputMetaGenerator is enabled.
      // Site owners often disable it, so its absence is not negative evidence.
      "<meta(?=\\s)(?=[^>]*\\sname\\s*=\\s*[\"']generator[\"'])[^>]*\\scontent\\s*=\\s*[\"']basercms[\"']",
    ],
  },
  // Supplementary confirmation only: /baser/admin/ is the default admin
  // prefix (BASER_CORE_PREFIX / ADMIN_PREFIX) and can be changed per site.
  activeRules: [
    {
      path: "/baser/admin/",
      bodyRegexes: [
        // Admin login form markup from the bc-admin-third theme.
        "id=[\"']AdminUsersLoginScript[\"']",
        "class=[\"'][^\"']*\\bbca-login\\b",
      ],
    },
  ],
  impliedSoftwares: [cakePhpSignature.name, phpSignature.name],
};
