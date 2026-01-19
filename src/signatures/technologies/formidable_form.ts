import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const formidableFormSignature: Signature = {
  name: "Formidable Form",
  description: "Formidable Forms is a WordPress plugin that enables you to create quizzes, surveys, calculators, timesheets, multi-page application forms.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+\\/wp\\-content\\/plugins\\/formidable\\/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
