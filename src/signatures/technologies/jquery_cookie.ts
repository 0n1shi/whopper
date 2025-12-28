import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const jqueryCookieSignature: Signature = {
  name: "jQuery Cookie",
  description:
    "A simple, lightweight jQuery plugin for reading, writing and deleting cookies.",
  cpe: "cpe:/a:jquery.cookie_project:jquery.cookie",
  rule: {
    confidence: "high",
    urls: ["jquery-cookie/(\\d+\\.\\d+\\.\\d+)?"],
  },
  impliedSoftwares: [jquerySignature.name],
};
