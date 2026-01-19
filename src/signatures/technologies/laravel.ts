import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const laravelSignature: Signature = {
  name: "Laravel",
  description: "Laravel is a free, open-source PHP web framework.",
  cpe: "cpe:2.3:a:laravel:laravel:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    cookies: {
      laravel_session: ".+",
    },
    javascriptVariables: {
      Laravel: "",
    },
  },
  impliedSoftwares: [phpSignature.name],
};
