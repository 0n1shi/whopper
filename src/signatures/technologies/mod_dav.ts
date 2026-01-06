import type { Signature } from "../_types.js";
import { apacheHttpServerSignature } from "./apache.js";

export const modDavSignature: Signature = {
  name: "mod_dav",
  description:
    "Mod_dav is an Apache module to provide WebDAV capabilities for your Apache web server.",
  rule: {
    confidence: "high",
    headers: {
      Server: "\\b(?:mod_)?DAV\\b(?:/([\\d.]+))?",
    },
  },
  impliedSoftwares: [apacheHttpServerSignature.name],
};
