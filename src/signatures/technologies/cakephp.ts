import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const cakePhpSignature: Signature = {
  name: "CakePHP",
  description: "CakePHP is an open-source web framework. It follows the model-view-controller (MVC) approach and is written in PHP.",
  cpe: "cpe:2.3:a:cakephp:cakephp:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    cookies: {
      "cakephp": "",
    },
    bodies: [
      "<meta[^>]+name=[\"']application-name[\"'][^>]+content=[\"']CakePHP",
    ],
  },
  impliedSoftwares: [phpSignature.name],
};
