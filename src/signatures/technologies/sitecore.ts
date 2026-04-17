import type { Signature } from "../_types.js";
import { aspNetSignature } from "./asp_net.js";

export const sitecoreSignature: Signature = {
  name: "Sitecore",
  description: "Sitecore provides web content management, and multichannel marketing automation software.",
  rule: {
    confidence: "high",
    cookies: {
      "SC_ANALYTICS_GLOBAL_COOKIE": "",
      "SC_OS_SessionId": "",
      "sc_expview": "",
      "sxa_site": "",
    },
    bodies: [
      "/_sitecore/",
      "/-/media/",
      "/~/media/.+\\.ashx",
    ],
    javascriptVariables: {
      "SitecoreUtilities": "",
    },
  },
  impliedSoftwares: [aspNetSignature.name],
};
