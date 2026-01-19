import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const codeIgniterSignature: Signature = {
  name: "CodeIgniter",
  description: "CodeIgniter is an open-source PHP web framework.",
  cpe: "cpe:/a:codeigniter:codeigniter",
  rule: {
    confidence: "high",
    cookies: {
      ci_csrf_token: ".+",
      ci_session: ".+",
      exp_last_activity: ".+",
      exp_tracker: ".+",
    },
    bodies: ["<input[^>]+name=\"ci_csrf_token\""],
  },
  impliedSoftwares: [phpSignature.name],
};
