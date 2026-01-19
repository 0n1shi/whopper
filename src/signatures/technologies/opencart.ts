import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";
import { mysqlSignature } from "./mysql.js";

export const opencartSignature: Signature = {
  name: "OpenCart",
  description: "OpenCart is a free and open-source ecommerce platform used for creating and managing online stores. It is written in PHP and uses a MySQL database to store information.",
  cpe: "cpe:/a:opencart:opencart",
  rule: {
    confidence: "high",
    cookies: {
      "OCSESSID": "",
    },
    bodies: [
      "href[^>]+catalog\\/view\\/theme\\/rgen\\-opencart\\/",
    ],
  },
  impliedSoftwares: [phpSignature.name, mysqlSignature.name],
};
