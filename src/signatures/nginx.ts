import type { Signature } from "./_types.js";

export const nginxSignature: Signature = {
  name: "Nginx",
  confidence: "high",
  rules: [
    {
      headers: {
        server: { regex: "^nginx/?(\\d+\\.\\d+\\.\\d+)?" },
      },
    },
  ],
};
