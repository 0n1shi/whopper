import type { Signature } from "../_types.js";
import { apacheHttpServerSignature } from "./apache.js";
import { pythonSignature } from "./python.js";

export const modWsgiSignature: Signature = {
  name: "mod_wsgi",
  description:
    "mod_wsgi is an Apache HTTP Server module that provides a WSGI compliant interface for hosting Python based web applications under Apache.",
  cpe: "cpe:/a:modwsgi:mod_wsgi",
  rule: {
    confidence: "high",
    headers: {
      Server: "mod_wsgi(?:/([\\d.]+))?",
      "X-Powered-By": "mod_wsgi(?:/([\\d.]+))?",
    },
  },
  impliedSoftwares: [pythonSignature.name, apacheHttpServerSignature.name],
};
