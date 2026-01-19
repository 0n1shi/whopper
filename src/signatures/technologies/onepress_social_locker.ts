import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const onepressSocialLockerSignature: Signature = {
  name: "OnePress Social Locker",
  description: "Social Locker locks your most valuable site content behind a set of social buttons until the visitor likes, shares, +1s or tweets your page.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/social-?locker(?:-next-premium)?/bizpanda/assets/",
    ],
    javascriptVariables: {
      "__pandalockers": "",
      "bizpanda": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
