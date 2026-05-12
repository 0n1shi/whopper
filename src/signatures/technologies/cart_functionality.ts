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
      "<a\\b[^>]*\\s+href=[\"'][^\"']*/cart",
      "<a\\b[^>]*\\s+href=[\"'][^\"']*/order",
      "<a\\b[^>]*\\s+href=[\"'][^\"']*/basket",
      "<a\\b[^>]*\\s+href=[\"'][^\"']*/trolley",
      "<a\\b[^>]*\\s+href=[\"'][^\"']*/bag/",
      "<a\\b[^>]*\\s+href=[\"'][^\"']*/shoppingbag",
      "<a\\b[^>]*\\s+href=[\"'][^\"']*/checkout",
      "<a\\b[^>]*\\s+href=[\"'][^\"']*/winkelwagen",
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
