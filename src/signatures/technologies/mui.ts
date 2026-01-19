import type { Signature } from "../_types.js";
import { reactSignature } from "./react.js";

export const muiSignature: Signature = {
  name: "MUI",
  description: "MUI (formerly Material UI) is a simple and customizable component library to build faster, beautiful, and more accessible React applications.",
  rule: {
    confidence: "high",
    bodies: [
      "MuiPaper-root",
      "MuiBox-root",
      "data-meta=[\"']MuiPaper[\"']",
      "data-meta=[\"']MuiButton[\"']",
    ],
  },
  impliedSoftwares: [reactSignature.name],
};
