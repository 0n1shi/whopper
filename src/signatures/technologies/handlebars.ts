import type { Signature } from "../_types.js";

export const handlebarsSignature: Signature = {
  name: "Handlebars",
  description:
    "Handlebars is a JavaScript library used to create reusable webpage templates.",
  cpe: "cpe:/a:handlebars.js_project:handlebars.js",
  rule: {
    confidence: "high",
    urls: [
      "handlebars(?:\\.runtime)?(?:-v([\\d.]+?))?(?:\\.min)?\\.js",
    ],
    bodies: ["type=[^>]*text/x-handlebars-template"],
    javascriptVariables: {
      Handlebars: "",
      "Handlebars.VERSION": "^(.+)$",
    },
  },
};
