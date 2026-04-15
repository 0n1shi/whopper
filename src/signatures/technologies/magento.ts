import type { Signature } from "../_types.js";
import { mysqlSignature } from "./mysql.js";
import { phpSignature } from "./php.js";

export const magentoSignature: Signature = {
  name: "Magento",
  description: "Magento is an open-source ecommerce platform written in PHP.",
  cpe: "cpe:/a:magento:magento",
  rule: {
    confidence: "high",
    headers: {
      "Content-Security-Policy": "widgets\\.magentocommerce\\.com",
      "Content-Security-Policy-Report-Only": "widgets\\.magentocommerce\\.com",
    },
    urls: ["js/mage", "static/_requirejs", "skin/frontend/"],
    bodies: [
      "data-requiremodule=\"[^\"]*(?:mage/|Magento_)",
      "text/x-magento-init",
      "data-image-optimizing-origin",
    ],
    cookies: {
      "X-Magento-Vary": ".*",
      frontend: ".*",
      "mage-cache-storage": ".*",
      "mage-cache-storage-section-invalidation": ".*",
      "mage-translation-file-version": ".*",
      "mage-translation-storage": ".*",
    },
    javascriptVariables: {
      Mage: "",
      VarienForm: "",
    },
  },
  activeRules: [
    {
      path: "/magento_version",
      bodyRegex: "^Magento/(\\S+)",
    },
  ],
  impliedSoftwares: [phpSignature.name, mysqlSignature.name],
};
