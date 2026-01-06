import type { Signature } from "../_types.js";
import { apacheHttpServerSignature } from "./apache.js";

export const modSslSignature: Signature = {
  name: "mod_ssl",
  description:
    "mod_ssl is an optional module for the Apache HTTP Server. It provides strong cryptography for the Apache web server via SSL and TLS.",
  cpe: "cpe:/a:modssl:mod_ssl",
  rule: {
    confidence: "high",
    headers: {
      Server: "mod_ssl(?:/([\\d.]+))?",
    },
  },
  impliedSoftwares: [apacheHttpServerSignature.name],
};
