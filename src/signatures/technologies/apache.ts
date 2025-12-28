import type { Signature } from "../_types.js";

export const apacheHttpServerSignature: Signature = {
  name: "Apache HTTP Server",
  description:
    "Apache is a free and open-source cross-platform web server software.",
  cpe: "cpe:/a:apache:http_server",
  rule: {
    confidence: "high",
    headers: {
      server: "apache/?(\\d+\\.\\d+\\.\\d+)?",
    },
  },
};
