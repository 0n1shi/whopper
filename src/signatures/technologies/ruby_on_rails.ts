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
    // pipeline: Propshaft truncates SHA-1 to 8 chars (the default pipeline
    // since Rails 8), Sprockets 2 used MD5 (32 chars, Rails 3.1 to 4.1) and
    // Sprockets 3 onwards uses SHA-256 (64 chars, from the Rails 4.2/5.0 era).
    // Enumerate the three lengths rather than spanning a range, so unrelated
    // fingerprints such as a full 40-char SHA-1 cannot match.
    //
    // `^[^?#]*` keeps the match inside the URL path, so an asset path echoed
    // back in a query string (`/login?next=/assets/application-0a1b2c3d.js`)
    // does not count. The trailing boundary rejects `.json` / `.jsx` while
    // still allowing the sourcemap suffix both pipelines emit and any query or
    // fragment (Sprockets debug mode appends `?body=1`).
    //
    // Caveat: signature regexes are compiled case-insensitively, so an
    // uppercase digest matches too even though Rails only emits lowercase hex.
    urls: [
      "^[^?#]*/assets/application-(?:[a-f\\d]{8}|[a-f\\d]{32}|[a-f\\d]{64})\\.(?:js|css)(?:\\.map)?(?:$|[?#])",
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
