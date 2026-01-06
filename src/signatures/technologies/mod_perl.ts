import type { Signature } from "../_types.js";
import { apacheHttpServerSignature } from "./apache.js";
import { perlSignature } from "./perl.js";

export const modPerlSignature: Signature = {
  name: "mod_perl",
  description:
    "Mod_perl is an optional module for the Apache HTTP server. It embeds a Perl interpreter into the Apache server.",
  cpe: "cpe:2.3:a:apache:mod_perl:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    headers: {
      Server: "mod_perl(?:/([\\d\\.]+))?",
    },
  },
  impliedSoftwares: [perlSignature.name, apacheHttpServerSignature.name],
};
