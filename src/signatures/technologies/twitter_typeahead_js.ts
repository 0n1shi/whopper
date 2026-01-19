import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const twitterTypeaheadSignature: Signature = {
  name: "Twitter typeahead.js",
  rule: {
    confidence: "high",
    urls: [
      "(?:typeahead|bloodhound)\\.(?:jquery|bundle)?(?:\\.min)?\\.js",
    ],
    javascriptVariables: {
      "typeahead": "",
    },
  },
  impliedSoftwares: [jquerySignature.name],
};
