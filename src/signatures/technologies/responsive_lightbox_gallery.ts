import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const responsiveLightboxGallerySignature: Signature = {
  name: "Responsive Lightbox & Gallery",
  description:
    "Responsive Lightbox & Gallery plugin is a lightweight WordPress gallery plugin by Digital Factory.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/responsive-lightbox/.+front\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
    javascriptVariables: {
      "rlArgs.activeGalleries": "",
      rl_hide_image: "",
      rl_view_image: "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
