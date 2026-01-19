import type { Signature } from "../_types.js";

export const zendeskSignature: Signature = {
  name: "Zendesk",
  description: "Zendesk is a cloud-based help desk management solution offering customizable tools to build customer service portal, knowledge base and online communities.",
  rule: {
    confidence: "high",
    headers: {
      "x-zendesk-user-id": "",
    },
    cookies: {
      "_help_center_session": "",
      "_zendesk_cookie": "",
      "_zendesk_shared_session": "",
    },
    urls: [
      "static\\.zdassets\\.com",
    ],
    javascriptVariables: {
      "Zendesk": "",
    },
  },
};
