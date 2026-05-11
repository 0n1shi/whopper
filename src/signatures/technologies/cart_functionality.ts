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
      "<a\\b[^>]+href=[\"'][^\"']*/cart",
      "<a\\b[^>]+href=[\"'][^\"']*/order",
      "<a\\b[^>]+href=[\"'][^\"']*/basket",
      "<a\\b[^>]+href=[\"'][^\"']*/trolley",
      "<a\\b[^>]+href=[\"'][^\"']*/bag/",
      "<a\\b[^>]+href=[\"'][^\"']*/shoppingbag",
      "<a\\b[^>]+href=[\"'][^\"']*/checkout",
      "<a\\b[^>]+href=[\"'][^\"']*/winkelwagen",
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
