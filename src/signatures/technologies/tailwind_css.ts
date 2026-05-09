import type { Signature } from "../_types.js";

export const tailwindCssSignature: Signature = {
  name: "Tailwind CSS",
  description: "Tailwind is a utility-first CSS framework.",
  rule: {
    confidence: "high",
    bodies: [
      "--tw-(?:rotate|translate|space-x|text-opacity|border-opacity)",
      "<link[^>]+href=[\"'][^\"']*tailwindcss[@/](?:\\^)?([\\d.]+)(?:/[a-z]+)?/(?:tailwind|base|components|utilities)(?:\\.min)?\\.css",
      "<link[^>]+href=[\"'][^\"']*tailwind[^\"']*\\.css",
    ],
    urls: ["\\.tailwindcss(?:tailwind-config-cdn)?\\.(?:com|js)"],
    javascriptVariables: {
      tailwind: "",
    },
  },
};
