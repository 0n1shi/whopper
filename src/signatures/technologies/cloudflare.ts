import type { Signature } from "../_types.js";

export const cloudflareSignature: Signature = {
  name: "Cloudflare",
  description:
    "Cloudflare is a web-infrastructure and website-security company, providing CDN, DDoS mitigation, Internet security, and DNS services.",
  runtime: "server",
  rule: {
    confidence: "high",
    headers: {
      server: "^cloudflare$",
      "cf-cache-status": "",
      "cf-ray": "",
    },
    cookies: {
      __cfduid: "",
    },
    javascriptVariables: {
      CloudFlare: "",
    },
  },
};
