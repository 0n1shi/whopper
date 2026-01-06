import type { Signature } from "../_types.js";
import { mysqlSignature } from "./mysql.js";
import { phpSignature } from "./php.js";

export const magentoSignature: Signature = {
  name: "Magento",
  description: "Magento is an open-source ecommerce platform written in PHP.",
  cpe: "cpe:2.3:a:magento:magento:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
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
  impliedSoftwares: [phpSignature.name, mysqlSignature.name],
};
