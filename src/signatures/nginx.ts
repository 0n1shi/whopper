import type { Signature } from "./_types.js";

export const nginxSignature: Signature = {
  name: "Nginx",
  description:
    "An HTTP web server, reverse proxy, content cache, load balancer, TCP/UDP proxy server, and mail proxy server.",
  cpe: "cpe:/a:nginx:nginx",
  rule: {
    confidence: "high",
    headers: {
      server: "^nginx/?(\\d+\\.\\d+\\.\\d+)?",
    },
  },
};
