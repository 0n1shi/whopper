import type { Signature } from "../_types.js";
import { rubySignature } from "./ruby.js";

export const rubyOnRailsSignature: Signature = {
  name: "Ruby on Rails",
  description:
    "Ruby on Rails is a server-side web application framework written in Ruby under the MIT License.",
  cpe: "cpe:/a:rubyonrails:rails",
  rule: {
    confidence: "high",
    headers: {
      server: "mod_(?:rails|rack)",
      "x-powered-by": "mod_(?:rails|rack)",
    },
    cookies: {
      _session_id: ".+",
    },
    // Rails fingerprints assets with a hex digest whose length identifies the
    // pipeline: Propshaft truncates SHA-1 to 8 chars (default since Rails 8),
    // Sprockets uses MD5 (32) up to Rails 5.1 and SHA-256 (64) from 5.2.
    // Enumerate the three lengths rather than spanning a range, so unrelated
    // fingerprints such as a full 40-char SHA-1 cannot match.
    urls: [
      "/assets/application-(?:[a-f\\d]{8}|[a-f\\d]{32}|[a-f\\d]{64})\\.js",
    ],
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
