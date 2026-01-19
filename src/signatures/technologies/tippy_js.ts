import type { Signature } from "../_types.js";

export const tippyJsSignature: Signature = {
  name: "Tippy.js",
  description: "Tippy.js is the complete tooltip, popover, dropdown, and menu solution for the web, powered by Popper.",
  rule: {
    confidence: "high",
    bodies: [
      "data-tippy-stylesheet",
    ],
    urls: [
      "/tippy\\.js(?:@|/)?([\\d\\.]+)?",
    ],
    javascriptVariables: {
      "tippy.defaultProps": "",
    },
  },
};
