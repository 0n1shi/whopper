import type { Signature } from "../_types.js";
import { nodeJsSignature } from "./node_js.js";

export const expressSignature: Signature = {
  name: "Express",
  description:
    "Express is a web application framework for Node.js, released as free and open-source software under the MIT License. It is designed for building web applications and APIs.",
  cpe: "cpe:/a:expressjs:express",
  rule: {
    confidence: "high",
    headers: {
      "x-powered-by": "^Express(?:$|,)",
    },
  },
  impliedSoftwares: [nodeJsSignature.name],
};
