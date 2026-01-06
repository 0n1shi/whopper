import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const mailchimpForWordPressSignature: Signature = {
  name: "MailChimp for WordPress",
  description:
    "MailChimp for WordPress is an email marketing plugin that enables you to build subscriber lists.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/mailchimp-for-wp/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
    javascriptVariables: {
      mc4wp: "",
    },
    bodies: ["/wp-content/plugins/mailchimp-for-wp/"],
  },
  impliedSoftwares: [wordpressSignature.name],
};
