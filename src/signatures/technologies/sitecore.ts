import type { Signature } from "../_types.js";
import { microsoftAspSignature } from "./microsoft_asp.js";

export const sitecoreSignature: Signature = {
  name: "Sitecore",
  description: "Sitecore provides web content management, and multichannel marketing automation software.",
  cpe: "cpe:/a:sitecore:sitecore",
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
  impliedSoftwares: [microsoftAspSignature.name],
};
