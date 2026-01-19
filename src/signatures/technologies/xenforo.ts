import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";
import { mysqlSignature } from "./mysql.js";

export const xenforoSignature: Signature = {
  name: "XenForo",
  description: "XenForo is a PHP-based forum hosting program for communities that is designed to be deployed on a remote web server.",
  rule: {
    confidence: "high",
    cookies: {
      "xf_csrf": "",
      "xf_session": "",
    },
    bodies: [
      "(?:jQuery\\.extend\\(true, XenForo|<a[^>]+>Forum software by XenForo™|<!--XF:branding|<html[^>]+id=\"XenForo\")",
      "<html id=\"XF\" ",
    ],
    javascriptVariables: {
      "XF.GuestUsername": "",
    },
  },
  impliedSoftwares: [phpSignature.name, mysqlSignature.name],
};
