import type { Signature } from "../_types.js";
import { stripeSignature } from "./stripe.js";
import { wordpressSignature } from "./wordpress.js";

export const woocommerceStripePaymentGatewaySignature: Signature = {
  name: "WooCommerce Stripe Payment Gateway",
  description: "WooCommerce Stripe Payment Gateway plugin extends WooCommerce allowing you to take payments directly on your store via Stripe’s API.",
  rule: {
    confidence: "high",
    bodies: [
      "<link\\b[^>]*\\s+href=[\"'][^\"']*\\/wp\\-content\\/plugins\\/woocommerce\\-gateway\\-stripe\\/",
    ],
    urls: [
      "/wp-content/plugins/woocommerce-gateway-stripe/",
    ],
  },
  impliedSoftwares: [stripeSignature.name, wordpressSignature.name],
};
