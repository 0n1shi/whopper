import type { Signature } from "../_types.js";

export const loadableComponentsSignature: Signature = {
  name: "Loadable-Components",
  description: "Loadable-Components is a library to solve the React code-splitting client-side and server-side.",
  rule: {
    confidence: "high",
    bodies: [
      "__LOADABLE_REQUIRED_CHUNKS__",
    ],
    javascriptVariables: {
      "__LOADABLE_LOADED_CHUNKS__": "",
    },
  },
};
