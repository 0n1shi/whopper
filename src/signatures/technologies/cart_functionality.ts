import type { Signature } from "../_types.js";

export const cartFunctionalitySignature: Signature = {
  name: "Cart Functionality",
  description:
    "Websites that have a shopping cart or checkout page, either using a known ecommerce platform or a custom solution.",
  rule: {
    confidence: "high",
    urls: [
      "/(?:cart|order|basket|trolley|bag|shoppingbag|checkout)",
      "googlecommerce\\.com/trustedstores/api/js",
    ],
    bodies: [
      "href=[\"'][^\"']*/cart",
      "href=[\"'][^\"']*/order",
      "href=[\"'][^\"']*/basket",
      "href=[\"'][^\"']*/trolley",
      "href=[\"'][^\"']*/bag/",
      "href=[\"'][^\"']*/shoppingbag",
      "href=[\"'][^\"']*/checkout",
      "href=[\"'][^\"']*/winkelwagen",
      "aria-controls=[\"']cart[\"']",
      "class=[\"'][^\"']*shopping-bag",
      "class=[\"'][^\"']*shopping-cart",
      "class=[\"'][^\"']*checkout",
      "class=[\"'][^\"']*winkelwagen",
    ],
    javascriptVariables: {
      "google_tag_params.ecomm_pagetype": "",
    },
  },
};
