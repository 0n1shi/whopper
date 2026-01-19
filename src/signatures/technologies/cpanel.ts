import type { Signature } from "../_types.js";

export const cpanelSignature: Signature = {
  name: "cPanel",
  description: "cPanel is a web hosting control panel. The software provides a graphical interface and automation tools designed to simplify the process of hosting a website.",
  cpe: "cpe:/a:cpanel:cpanel",
  rule: {
    confidence: "high",
    headers: {
      "Server": "cpsrvd/([\\d.]+)",
    },
    cookies: {
      "cprelogin": "",
      "cpsession": "",
    },
    bodies: [
      "<!-- cPanel",
    ],
  },
};
