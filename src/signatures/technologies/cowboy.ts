import type { Signature } from "../_types.js";
import { erlangSignature } from "./erlang.js";

export const cowboySignature: Signature = {
  name: "Cowboy",
  description: "Cowboy is a small, fast, modular HTTP server written in Erlang.",
  rule: {
    confidence: "high",
    headers: {
      "Server": "^Cowboy$",
    },
  },
  impliedSoftwares: [erlangSignature.name],
};
