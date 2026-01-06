import type { Signature } from "../_types.js";

export const zurbFoundationSignature: Signature = {
  name: "ZURB Foundation",
  description:
    "Zurb Foundation is used to prototype in the browser. Allows rapid creation of websites or applications while leveraging mobile and responsive technology. The front end framework is the collection of HTML, CSS, and Javascript containing design patterns.",
  rule: {
    confidence: "high",
    bodies: [
      "<link[^>]+foundation[^>\"]+css",
      "<div [^>]*class=\"[^\"]*(?:small|medium|large)-\\d{1,2} columns",
    ],
    javascriptVariables: {
      "Foundation.version": "([\\d.]+)",
    },
  },
};
