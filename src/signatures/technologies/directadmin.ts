import type { Signature } from "../_types.js";
import { apacheHttpServerSignature } from "./apache.js";
import { phpSignature } from "./php.js";

export const directAdminSignature: Signature = {
  name: "DirectAdmin",
  description:
    "DirectAdmin is a graphical web-based web hosting control panel designed to make administration of websites easier.",
  cpe: "cpe:2.3:a:directadmin:directadmin:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    headers: {
      Server: "DirectAdmin Daemon v([\\d.]+)",
    },
    bodies: ["<a[^>]+>DirectAdmin</a> Web Control Panel"],
  },
  impliedSoftwares: [phpSignature.name, apacheHttpServerSignature.name],
};
