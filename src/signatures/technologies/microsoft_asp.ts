import type { Signature } from "../_types.js";

export const microsoftAspSignature: Signature = {
  name: "Microsoft ASP",
  description:
    "ASP.NET is an open-source, server-side web-application framework designed for web development to produce dynamic web pages.",
  cpe: "cpe:/a:microsoft:asp.net",
  rule: {
    confidence: "high",
    urls: ["\\.aspx"],
    bodies: ['<input[^>]+name="__VIEWSTATE'],
    cookies: {
      "ASP\\.NET_SessionId": "",
      ASPSESSION: "",
    },
    javascriptVariables: {
      "X-AspNet-Version": "(\\d+\\.\\d+\\.\\d+)",
      "X-Powered-By": "^ASP\\.NET",
      "set-cookie": "\\.AspNetCore",
    },
  },
};
