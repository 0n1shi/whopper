import type { Signature } from "../_types.js";
import { reactSignature } from "./react.js";

export const remixSignature: Signature = {
  name: "Remix",
  description: "Remix is a React framework used for server-side rendering (SSR).",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "__remixContext": "",
    },
  },
  impliedSoftwares: [reactSignature.name],
};
