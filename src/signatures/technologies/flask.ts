import type { Signature } from "../_types.js";
import { pythonSignature } from "./python.js";

export const flaskSignature: Signature = {
  name: "Flask",
  description: "Flask is a micro web framework written in Python.",
  cpe: "cpe:/a:palletsprojects:flask",
  rule: {
    confidence: "high",
    headers: {
      Server: "Werkzeug/?([\\d\\.]+)?",
    },
  },
  impliedSoftwares: [pythonSignature.name],
};
