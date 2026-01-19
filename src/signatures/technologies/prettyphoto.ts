import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const prettyphotoSignature: Signature = {
  name: "prettyPhoto",
  rule: {
    confidence: "high",
    bodies: [
      "(?:<link [^>]*href=\"[^\"]*prettyPhoto(?:\\.min)?\\.css|<a [^>]*rel=\"prettyPhoto)",
    ],
    urls: [
      "jquery\\.prettyPhoto\\.js",
    ],
    javascriptVariables: {
      "pp_alreadyInitialized": "",
      "pp_descriptions": "",
      "pp_images": "",
      "pp_titles": "",
    },
  },
  impliedSoftwares: [jquerySignature.name],
};
