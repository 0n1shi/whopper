import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const pixelyoursiteSignature: Signature = {
  name: "PixelYourSite",
  description: "PixelyourSite is now probably the most complex tracking tool for WordPress, managing the Facebook Pixel, Google Analytics, Google Ads Remarketing, Pinterest Tag, Bing Tag, and virtually any other script.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/pixelyoursite/",
    ],
    javascriptVariables: {
      "pys.Facebook": "",
      "pysOptions": "",
      "pys_generate_token": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
