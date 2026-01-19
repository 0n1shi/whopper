import type { Signature } from "../_types.js";
import { rubyOnRailsSignature } from "./ruby_on_rails.js";

export const redmineSignature: Signature = {
  name: "Redmine",
  description: "Redmine is a free and open-source, web-based project management and issue tracking tool.",
  cpe: "cpe:/a:redmine:redmine",
  rule: {
    confidence: "high",
    cookies: {
      "_redmine_session": "",
    },
    bodies: [
      "Powered by <a href=\"[^>]+Redmine",
      "<meta[^>]+name=[\"']description[\"'][^>]+content=[\"']Redmine",
    ],
  },
  impliedSoftwares: [rubyOnRailsSignature.name],
};
