import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const jqueryPjaxSignature: Signature = {
  name: "jQuery-pjax",
  description: "jQuery PJAX is a plugin that uses AJAX and pushState.",
  rule: {
    confidence: "high",
    bodies: [
      "<div[^>]+data-pjax-container",
      "<meta[^>]+name=[\"']pjax-push[\"']",
      "<meta[^>]+name=[\"']pjax-replace[\"']",
      "<meta[^>]+name=[\"']pjax-timeout[\"']",
    ],
    urls: [
      "jquery[.-]pjax(?:-([\\d.]))?(?:\\.min)?\\.js(?:\\?ver=([\\d.]+))?",
    ],
    javascriptVariables: {
      "jQuery.pjax": "",
    },
  },
  impliedSoftwares: [jquerySignature.name],
};
