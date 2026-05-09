import type { Signature } from "../_types.js";

const phpinfoVersionRegexes = [
  "<h1[^>]*>PHP Version (\\d+\\.\\d+\\.\\d+)",
  "PHP Version\\s*</td>\\s*<td[^>]*>(\\d+\\.\\d+\\.\\d+)",
];

export const phpSignature: Signature = {
  name: "PHP",
  description:
    "PHP is a popular general-purpose scripting language that is especially suited to web development.",
  cpe: "cpe:/a:php:php",
  rule: {
    confidence: "high",
    urls: ["\\.php$"],
    headers: {
      server: "php/?(\\d+\\.\\d+\\.\\d+)?",
      "x-powered-by": "php/?(\\d+\\.\\d+\\.\\d+)?",
    },
    cookies: {
      PHPSESSID: ".+",
    },
  },
  activeRules: [
    { path: "/info.php", bodyRegexes: phpinfoVersionRegexes },
    { path: "/test.php", bodyRegexes: phpinfoVersionRegexes },
    { path: "/phpinfo.php", bodyRegexes: phpinfoVersionRegexes },
  ],
};
