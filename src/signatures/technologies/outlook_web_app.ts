import type { Signature } from "../_types.js";
import { microsoftAspSignature } from "./microsoft_asp.js";

export const outlookWebAppSignature: Signature = {
  name: "Outlook Web App",
  description: "Outlook on the web is an information manager web app. It includes a web-based email client, a calendar tool, a contact manager, and a task manager.",
  cpe: "cpe:/a:microsoft:outlook_web_access",
  rule: {
    confidence: "high",
    headers: {
      "X-OWA-Version": "([\\d\\.]+)?",
    },
    bodies: [
      "<link[^>]+/owa/auth/([\\d\\.]+)/themes/resources",
    ],
    urls: [
      "/owa/auth/log(?:on|off)\\.aspx",
    ],
    javascriptVariables: {
      "IsOwaPremiumBrowser": "",
    },
  },
  impliedSoftwares: [microsoftAspSignature.name],
};
