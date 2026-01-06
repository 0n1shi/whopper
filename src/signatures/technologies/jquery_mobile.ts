import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const jqueryMobileSignature: Signature = {
  name: "jQuery Mobile",
  description:
    "jQuery Mobile is a HTML5-based user interface system designed to make responsive web sites and apps that are accessible on all smartphone, tablet and desktop devices.",
  rule: {
    confidence: "high",
    urls: ["jquery[.-]mobile(?:-([\\d.]+))?(?:\\.min)?\\.js"],
    javascriptVariables: {
      "jQuery.mobile.version": "^(.+)$",
    },
  },
  impliedSoftwares: [jquerySignature.name],
};
