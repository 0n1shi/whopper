import type { Signature } from "../_types.js";

export const makeShopSignature: Signature = {
  name: "MakeShop",
  description: "MakeShop is a Japanese ecommerce platform.",
  rule: {
    confidence: "high",
    bodies: [
      "gigaplus\\.makeshop\\.jp",
    ],
    javascriptVariables: {
      "MakeShop_TopSearch": "",
      "makeshop_ga_gtag": "",
    },
  },
};
