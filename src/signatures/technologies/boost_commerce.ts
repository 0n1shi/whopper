import type { Signature } from "../_types.js";
import { shopifySignature } from "./shopify.js";

export const boostCommerceSignature: Signature = {
  name: "Boost Commerce",
  description: "Boost Commerce provides beautiful and advanced product filter and smart site search for Shopify stores to boost sales.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "bcSfFilterConfig.api.filterUrl": "services\\.mybcapps\\.com/",
      "boostPFSAppConfig.api.filterUrl": "services\\.mybcapps\\.com/",
    },
  },
  impliedSoftwares: [shopifySignature.name],
};
