import type { Signature } from "../_types.js";
import { reactSignature } from "./react.js";

export const styledComponentsSignature: Signature = {
  name: "styled-components",
  description:
    "Styled components is a CSS-in-JS styling framework that uses tagged template literals in JavaScript.",
  rule: {
    confidence: "high",
    bodies: ["data-styled", "sc-component-id"],
    javascriptVariables: {
      styled: "",
    },
  },
  impliedSoftwares: [reactSignature.name],
};
