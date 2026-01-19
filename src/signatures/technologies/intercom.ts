import type { Signature } from "../_types.js";

export const intercomSignature: Signature = {
  name: "Intercom",
  description: "Intercom is an American software company that produces a messaging platform which allows businesses to communicate with prospective and existing customers within their app, on their website, through social media, or via email.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+https:\\/\\/widget.intercom.io",
      "live-chat-loader-placeholder",
      "intercom-frame",
    ],
    urls: [
      "(?:api\\.intercom\\.io/api|static\\.intercomcdn\\.com/intercom\\.v1)",
    ],
    javascriptVariables: {
      "Intercom": "",
    },
  },
};
