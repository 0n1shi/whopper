import type { Signature } from "../_types.js";
import { yiiSignature } from "./yii.js";

export const craftCmsSignature: Signature = {
  name: "Craft CMS",
  description: "Craft CMS is a content management system for building bespoke websites.",
  cpe: "cpe:/a:craftcms:craft_cms",
  rule: {
    confidence: "high",
    headers: {
      "X-Powered-By": "\\bCraft CMS\\b",
    },
    cookies: {
      "CraftSessionId": "",
    },
  },
  impliedSoftwares: [yiiSignature.name],
};
