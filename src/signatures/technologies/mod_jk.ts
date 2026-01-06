import type { Signature } from "../_types.js";
import { apacheTomcatSignature } from "./apache_tomcat.js";
import { apacheHttpServerSignature } from "./apache.js";

export const modJkSignature: Signature = {
  name: "mod_jk",
  description:
    "Mod_jk is an Apache module used to connect the Tomcat servlet container with web servers.",
  rule: {
    confidence: "high",
    headers: {
      Server: "mod_jk(?:/([\\d\\.]+))?",
    },
  },
  impliedSoftwares: [apacheTomcatSignature.name, apacheHttpServerSignature.name],
};
