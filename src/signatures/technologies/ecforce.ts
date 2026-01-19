import type { Signature } from "../_types.js";
import { rubySignature } from "./ruby.js";
import { rubyOnRailsSignature } from "./ruby_on_rails.js";
import { nginxSignature } from "./nginx.js";

export const ecforceSignature: Signature = {
  name: "EcForce",
  description: "EcForce is an all-in-one ecommerce platform with all the functions necessary for ecommerce, from landing-page creation to order and customer data management analysis.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "EcForce.Models": "",
      "EcForce.Models.Shop": "",
    },
  },
  impliedSoftwares: [rubySignature.name, rubyOnRailsSignature.name, nginxSignature.name],
};
