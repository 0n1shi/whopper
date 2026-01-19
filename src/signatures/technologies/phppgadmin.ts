import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const phppgadminSignature: Signature = {
  name: "phpPgAdmin",
  cpe: "cpe:/a:phppgadmin_project:phppgadmin",
  rule: {
    confidence: "high",
    bodies: [
      "(?:<title>phpPgAdmin</title>|<span class=\"appname\">phpPgAdmin)",
    ],
  },
  impliedSoftwares: [phpSignature.name],
};
