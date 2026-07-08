import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const thinkPhpSignature: Signature = {
  name: "ThinkPHP",
  description:
    "ThinkPHP is an open-source PHP framework with an MVC structure, developed and maintained by Shanghai Topthink. It is widely used in China.",
  cpe: "cpe:/a:thinkphp:thinkphp",
  rule: {
    confidence: "high",
    headers: {
      // ThinkPHP advertises itself via X-Powered-By. The version is usually
      // absent but captured when present (e.g. "ThinkPHP/6.0.12").
      "x-powered-by": "thinkphp/?(\\d+\\.\\d+\\.\\d+)?",
    },
    cookies: {
      // Page-trace cookie exposed when debug / page trace is enabled.
      thinkphp_show_page_trace: "",
    },
    bodies: [
      // Distinctive framework banner emitted by older ThinkPHP versions
      // (appears in an HTML comment on generated pages).
      "Fast & Simple OOP PHP Framework",
      // Framework source paths leaked on debug / exception pages (TP5.x).
      "/thinkphp/library/think/",
      // Default welcome page shown by fresh installs (V5 / V6 / V8, ...).
      "ThinkPHP\\s*V[3-8]",
    ],
  },
  impliedSoftwares: [phpSignature.name],
};
