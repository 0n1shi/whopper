import type { Signature } from "../_types.js";

export const flickitySignature: Signature = {
  name: "Flickity",
  description:
    "Flickity is a JavaScript slider library, built by David DeSandro of Metafizzy fame.",
  rule: {
    confidence: "high",
    urls: [
      "flickity(?:/|@)([\\d\\.]+).+flickity(?:\\.pkgd)?(?:\\.min)?\\.js",
    ],
    javascriptVariables: {
      Flickity: "",
    },
  },
};
