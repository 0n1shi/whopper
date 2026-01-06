import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const contactForm7Signature: Signature = {
  name: "Contact Form 7",
  description:
    "Contact Form 7 is a WordPress plugin which can manage multiple contact forms. The form supports Ajax-powered submitting, CAPTCHA, Akismet spam filtering.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/contact-form-7/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
    bodies: ["/wp-content/plugins/contact-form-7/"],
    javascriptVariables: {
      wpcf7: "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
