import type { Signature } from "../_types.js";
import { rubySignature } from "./ruby.js";

export const rubyOnRailsSignature: Signature = {
  name: "Ruby on Rails",
  description:
    "Ruby on Rails is a server-side web application framework written in Ruby under the MIT License.",
  cpe: "cpe:2.3:a:rubyonrails:rails:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    headers: {
      server: "mod_(?:rails|rack)",
      "x-powered-by": "mod_(?:rails|rack)",
    },
    cookies: {
      _session_id: ".+",
    },
    urls: ["/assets/application-[a-z\\d]{32}/\\.js"],
    bodies: [
      "<meta[^>]+name=[\"']csrf-param[\"'][^>]+content=[\"']authenticity_token[\"']",
    ],
    javascriptVariables: {
      ReactOnRails: "",
      __REACT_ON_RAILS_EVENT_HANDLERS_RAN_ONCE__: "",
    },
  },
  impliedSoftwares: [rubySignature.name],
};
