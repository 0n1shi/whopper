import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const squirrelMailSignature: Signature = {
  name: "SquirrelMail",
  description: "SquirrelMail is an open-source web-mail package that is based on PHP language. It provides a web-based email client and a proxy server for IMAP protocol.",
  cpe: "cpe:2.3:a:squirrelmail:squirrelmail:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    bodies: [
      "<small>SquirrelMail version ([.\\d]+)[^<]*<br",
    ],
    urls: [
      "/src/webmail\\.php(?:$|\\?)",
    ],
    javascriptVariables: {
      "squirrelmail_loginpage_onload": "",
    },
  },
  impliedSoftwares: [phpSignature.name],
};
