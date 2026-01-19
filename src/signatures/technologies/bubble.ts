import type { Signature } from "../_types.js";
import { nodeJsSignature } from "./node_js.js";

export const bubbleSignature: Signature = {
  name: "Bubble",
  description: "Bubble is a no-code platform that lets anyone build web apps without writing any code.",
  rule: {
    confidence: "high",
    headers: {
      "x-bubble-capacity-limit": "",
      "x-bubble-capacity-used": "",
      "x-bubble-perf": "",
    },
    javascriptVariables: {
      "_bubble_page_load_data": "",
      "bubble_environment": "",
      "bubble_hostname_modifier": "",
      "bubble_version": "",
    },
  },
  impliedSoftwares: [nodeJsSignature.name],
};
