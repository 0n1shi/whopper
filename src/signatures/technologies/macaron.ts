import type { Signature } from "../_types.js";
import { goSignature } from "./go.js";

export const macaronSignature: Signature = {
  name: "Macaron",
  description: "Macaron is a high productive and modular web framework in Go.",
  impliedSoftwares: [goSignature.name],
};
