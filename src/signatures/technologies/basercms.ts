import type { Signature } from "../_types.js";
import { cakePhpSignature } from "./cakephp.js";
import { phpSignature } from "./php.js";
import { baserCmsFingerprints } from "../fingerprints/basercms.js";

// Passive markers identify the product. Active scans compare admin assets
// with commit-pinned releases because the login page does not expose a version.
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
  // Default admin prefixes for 5.x and 4.x; sites may customize them.
  activeRules: [
    {
      path: "/baser/admin/",
      bodyRegexes: [
        // Admin login form markup from the bc-admin-third theme.
        "id=[\"']AdminUsersLoginScript[\"']",
        "class=[\"'][^\"']*\\bbca-login\\b",
      ],
      assetFingerprints: baserCmsFingerprints,
    },
    {
      path: "/admin/",
      bodyRegexes: [
        "class=[\"'][^\"']*\\bbca-login\\b",
        "id=[\"']LoginCredit[\"']",
      ],
      assetFingerprints: baserCmsFingerprints,
    },
  ],
  impliedSoftwares: [cakePhpSignature.name, phpSignature.name],
};
