import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const genesisThemeSignature: Signature = {
  name: "Genesis theme",
  description: "Genesis theme is a WordPress theme that has been developed using the Genesis Framework from Studiopress.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/themes/genesis/lib/js/",
    ],
    javascriptVariables: {
      "genesisBlocksShare": "",
      "genesis_responsive_menu": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
