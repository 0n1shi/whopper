import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const mailchimpForWooCommerceSignature: Signature = {
  name: "MailChimp for WooCommerce",
  description:
    "MailChimp for WooCommerce gives you the ability to automatically sync customer purchase data to your MailChimp account.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/mailchimp-for-woocommerce/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
