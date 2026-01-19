import type { Signature } from "../_types.js";
import { laravelSignature } from "./laravel.js";

export const livewireSignature: Signature = {
  name: "Livewire",
  description: "Livewire is a full-stack Laravel framework for building dynamic interfaces.",
  rule: {
    confidence: "high",
    bodies: [
      "<[^>]{1,512}\\bwire:",
    ],
    urls: [
      "livewire(?:\\.min)?\\.js",
    ],
    javascriptVariables: {
      "livewire": "",
    },
  },
  impliedSoftwares: [laravelSignature.name],
};
