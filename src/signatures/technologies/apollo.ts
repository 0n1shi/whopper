import type { Signature } from "../_types.js";

export const apolloSignature: Signature = {
  name: "Apollo",
  description:
    "Apollo is a fully-featured caching GraphQL client with integrations for React, Angular, and more.",
  rule: {
    confidence: "high",
    bodies: ["<script[^>]+id=\"__APOLLO_STATE__\""],
    javascriptVariables: {
      __APOLLO_CLIENT__: "",
      "__APOLLO_CLIENT__.version": "^(.+)$",
      "__NEXT_DATA__.props.pageProps.__APOLLO_STATE__": "",
    },
  },
};
