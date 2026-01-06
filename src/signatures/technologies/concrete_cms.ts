import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const concreteCmsSignature: Signature = {
  name: "Concrete CMS",
  description: "Concrete CMS is an open-source content management system.",
  cpe: "cpe:2.3:a:concrete5:concrete5:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    urls: ["/concrete/js/"],
    bodies: [
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']concrete5(?: - ([\\d.]+))?",
    ],
    javascriptVariables: {
      CCM_IMAGE_PATH: "",
      Concrete: "",
    },
  },
  impliedSoftwares: [phpSignature.name],
};
