import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const csCartSignature: Signature = {
  name: "CS Cart",
  description: "CS Cart is a turnkey ecommerce shopping cart software solution.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+.cs\\-cart.com",
      "target[^>]+_blank",
      "cs-cart",
      "com",
    ],
    urls: [
      "var/cache/misc/assets/js/tygh/scripts-(?:[\\d\\w]+)\\.js",
    ],
    javascriptVariables: {
      "fn_buy_together_apply_discount": "",
      "fn_calculate_total_shipping": "",
      "fn_compare_strings": "",
    },
  },
  impliedSoftwares: [phpSignature.name],
};
