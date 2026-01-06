import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const cookieNoticeSignature: Signature = {
  name: "Cookie Notice",
  description:
    "Cookie Notice provides a simple, customizable website banner that can be used to help your website comply with certain cookie consent requirements under the EU GDPR cookie law and CCPA regulations and includes seamless integration with Cookie Compliance to help your site comply with the latest updates to existing consent laws.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/cookie-notice/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
