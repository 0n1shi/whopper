import type { Signature } from "../_types.js";
import { mysqlSignature } from "./mysql.js";
import { phpSignature } from "./php.js";

export const wordpressSignature: Signature = {
  name: "WordPress",
  description:
    "WordPress is a free and open-source content management system written in PHP and paired with a MySQL or MariaDB database. Features include a plugin architecture and a template system.",
  cpe: "cpe:/a:wordpress:wordpress",
  rule: {
    confidence: "high",
    headers: {
      "x-pingback": ".+xmlrpc\\.php$",
      link: "https://api\\.w\\.org",
      "X-Redirect-By": "WordPress",
    },
    cookies: {},
    bodies: [
      "wp-content",
      "wp-includes",
      "wp-json",
      "wp\\.com",
      "WoredPress.*(\\d+\\.\\d+(\\.\\d+)?)?",
      "shareaholic:wp_version",
      "wp-embed\\.min\\.js",
    ],
  },
  impliedSoftwares: [phpSignature.name, mysqlSignature.name],
};
