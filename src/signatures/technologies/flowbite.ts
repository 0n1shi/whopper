import type { Signature } from "../_types.js";

export const flowbiteSignature: Signature = {
  name: "Flowbite",
  description:
    "Flowbite is an open-source library of UI components based on the utility-first Tailwind CSS framework featuring dark mode support, a Figma design system, and more.",
  rule: {
    confidence: "high",
    urls: ["/flowbite(?:@([\\d\\.]+)/|\\.bundle\\.js)"],
  },
};
