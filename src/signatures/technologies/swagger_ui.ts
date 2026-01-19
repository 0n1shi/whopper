import type { Signature } from "../_types.js";

export const swaggerUiSignature: Signature = {
  name: "Swagger UI",
  description: "Swagger UI is a collection of HTML, JavaScript, and CSS assets that dynamically generate documentation from a Swagger-compliant API.",
  rule: {
    confidence: "high",
    urls: [
      "(?:/([\\d.]+))?/swagger-ui-bundle\\.js",
    ],
  },
};
