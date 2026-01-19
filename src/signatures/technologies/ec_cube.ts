import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const ecCubeSignature: Signature = {
  name: "EC-CUBE",
  description: "EC-CUBE is an open source package used to build ecommerce sites.",
  cpe: "cpe:2.3:a:lockon:ec-cube:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    urls: [
      "eccube\\.js",
      "win_op\\.js",
    ],
  },
  impliedSoftwares: [phpSignature.name],
};
