import type { Signature } from "../_types.js";

export const hubSpotCmsHubSignature: Signature = {
  name: "HubSpot CMS Hub",
  description: "CMS Hub is a content management platform by HubSpot for marketers to manage, optimize, and track content performance on websites, blogs, and landing pages.",
  rule: {
    confidence: "high",
    headers: {
      "x-hs-hub-id": "",
      "x-powered-by": "HubSpot",
    },
    bodies: [
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']HubSpot",
    ],
  },
};
