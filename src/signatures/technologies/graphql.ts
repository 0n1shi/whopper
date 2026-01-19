import type { Signature } from "../_types.js";

export const graphqlSignature: Signature = {
  name: "GraphQL",
  description: "GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.",
  rule: {
    confidence: "high",
    bodies: [
      "<meta[^>]+name=[\"']store-config[\"'][^>]+content=[\"']graphqlMethod",
    ],
  },
};
