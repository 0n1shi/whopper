import type { Signature } from "../_types.js";

export const lightboxSignature: Signature = {
  name: "Lightbox",
  description:
    "Lightbox is a JavaScript library for displaying images and other content in an overlay.",
  cpe: "cpe:2.3:a:lightbox_photo_gallery_project:lightbox_photo_gallery:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    urls: ["lightbox(?:-plus-jquery)?.{0,32}\\.js"],
    bodies: [
      "<link [^>]*href=[\"'][^\"']+lightbox(?:\\.min)?\\.css",
    ],
  },
};
