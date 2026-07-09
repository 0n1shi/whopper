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
      // (2.x/3.x), e.g. `ThinkPHP</a><sup>3.1.3</sup> { Fast & Simple OOP PHP
      // Framework }`. The version is captured from the adjacent <sup> tag when
      // present, and the banner still matches (version-less) when it is not.
      // Body matching runs against raw response text with no HTML-entity
      // decoding, so accept both the literal "&" and the "&amp;" entity form.
      "(?:<sup>(\\d+\\.\\d+\\.\\d+)</sup>[\\s{]*)?Fast &(?:amp;)? Simple OOP PHP Framework",
      // Debug exception page footer emitted by newer versions (5.1 / 6 / 8).
      // The footer template renders `App::version()` (the full VERSION
      // constant), e.g. `ThinkPHP</a> <span>V6.0.13</span>`. Requiring three
      // numeric groups means the major-only welcome page ("ThinkPHP V6") is
      // never captured, so no inaccurate major-only CPE is produced. The
      // template puts a newline / indentation between </a> and <span>, so allow
      // whitespace with \s*.
      "ThinkPHP</a>\\s*<span>\\s*V(\\d+\\.\\d+\\.\\d+)",
      // Framework source paths leaked on debug / exception pages (TP5.x).
      "/thinkphp/library/think/",
      // Default welcome page shown by fresh installs (V5 / V6 / V8, ...).
      "ThinkPHP\\s*V[3-8]",
    ],
  },
  impliedSoftwares: [phpSignature.name],
};
