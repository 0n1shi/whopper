import type { Signature } from "../_types.js";
import { rubyOnRailsSignature } from "./ruby_on_rails.js";
import { vueJsSignature } from "./vue_js.js";

export const gitlabSignature: Signature = {
  name: "GitLab",
  description: "GitLab is a web-based DevOps lifecycle tool that provides a Git-repository manager providing wiki, issue-tracking and continuous integration and deployment pipeline features, using an open-source license.",
  cpe: "cpe:/a:gitlab:gitlab",
  rule: {
    confidence: "high",
    cookies: {
      "_gitlab_session": "",
    },
    bodies: [
      "<meta content=\"https?://[^/]+/assets/gitlab_logo-",
      "<header class=\"navbar navbar-fixed-top navbar-gitlab with-horizontal-nav\">",
      "<meta[^>]+name=[\"']og:site_name[\"'][^>]+content=[\"']^GitLab$",
    ],
    javascriptVariables: {
      "GitLab": "",
      "gl.dashboardOptions": "",
    },
  },
  impliedSoftwares: [rubyOnRailsSignature.name, vueJsSignature.name],
};
