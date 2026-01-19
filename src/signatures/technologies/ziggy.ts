import type { Signature } from "../_types.js";
import { laravelSignature } from "./laravel.js";
import { inertiaJsSignature } from "./inertia_js.js";

export const ziggySignature: Signature = {
  name: "Ziggy",
  description: "Ziggy is a library that allows using Laravel named routes in JavaScript.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "Ziggy": "",
    },
  },
  impliedSoftwares: [laravelSignature.name, inertiaJsSignature.name],
};
