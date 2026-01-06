import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const wooCommerceSignature: Signature = {
  name: "WooCommerce",
  description: "WooCommerce is an open-source ecommerce plugin for WordPress.",
  rule: {
    confidence: "high",
    urls: [
      "woocommerce",
      "/woocommerce(?:\\.min)?\\.js(?:\\?ver=([0-9.]+))?",
    ],
    bodies: [
      "class=\"[^\"]*woocommerce",
      "class=\"[^\"]*woocommerce-no-js",
    ],
    javascriptVariables: {
      woocommerce_params: "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
