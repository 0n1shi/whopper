import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";
import { mysqlSignature } from "./mysql.js";

export const phpmyadminSignature: Signature = {
  name: "phpMyAdmin",
  description: "PhpMyAdmin is a free and open-source administration tool for MySQL and MariaDB.",
  cpe: "cpe:/a:phpmyadmin:phpmyadmin",
  rule: {
    confidence: "high",
    headers: {
      "Set-Cookie": "phpMyAdmin_https",
    },
    bodies: [
      "!\\[CDATA\\[[^<]*PMA_VERSION:\\\"([\\d.]+)",
      "(?: \\| phpMyAdmin ([\\d.]+)<\\/title>|PMA_sendHeaderLocation\\(|<link [^>]*href=\"[^\"]*phpmyadmin\\.css\\.php)",
    ],
    javascriptVariables: {
      "pma_absolute_uri": "",
    },
  },
  impliedSoftwares: [phpSignature.name, mysqlSignature.name],
};
