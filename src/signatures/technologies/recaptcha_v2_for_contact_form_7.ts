import type { Signature } from "../_types.js";
import { contactForm7Signature } from "./contact_form_7.js";
import { wordpressSignature } from "./wordpress.js";

export const recaptchaV2ForContactForm7Signature: Signature = {
  name: "ReCaptcha v2 for Contact Form 7",
  description:
    "Contact Form 7 v5.1 dropped support for reCaptcha v2 along with the [recaptcha] tag December 2018. This plugin brings that functionality back from Contact Form 7 5.0.5 and re-adds the [recaptcha] tag.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/wpcf7-recaptcha/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
  },
  impliedSoftwares: [wordpressSignature.name, contactForm7Signature.name],
};
