import type { Signature } from "../_types.js";

export const svelteSignature: Signature = {
  name: "Svelte",
  description: "Svelte is a free and open-source front end compiler created by Rich Harris and maintained by the Svelte core team members.",
  rule: {
    confidence: "high",
    bodies: [
      "class[^>]+svelte\\-",
    ],
  },
};
