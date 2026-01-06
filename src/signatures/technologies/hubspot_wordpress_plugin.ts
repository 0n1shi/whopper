import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const hubSpotWordPressPluginSignature: Signature = {
  name: "HubSpot WordPress plugin",
  description:
    "HubSpot is a platform with all the tools and integrations you need for marketing, sales, and customer service. HubSpot WordPress plugin allows you to manage contacts (CRM), engage visitors with live chat and chatbots, add beautiful forms to pages, create engaging email marketing campaigns, and more.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "leadin_wordpress.leadinPluginVersion": "^([\\d.]+)$",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
