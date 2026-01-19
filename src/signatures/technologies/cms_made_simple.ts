import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const cmsMadeSimpleSignature: Signature = {
  name: "CMS Made Simple",
  cpe: "cpe:/a:cmsmadesimple:cms_made_simple",
  rule: {
    confidence: "high",
    cookies: {
      "CMSSESSID": "",
    },
    bodies: [
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']CMS Made Simple",
    ],
  },
  impliedSoftwares: [phpSignature.name],
};
