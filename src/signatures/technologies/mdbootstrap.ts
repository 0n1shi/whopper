import type { Signature } from "../_types.js";
import { bootstrapSignature } from "./bootstrap.js";

export const mdbootstrapSignature: Signature = {
  name: "MDBootstrap",
  description: "MDBootstrap (Material Design for Bootstrap) is a complete UI package that can be integrated with other frameworks such as Angular, React, Vue, etc. It is used to design a fully responsive and mobile-friendly layout using various components, plugins, animation.",
  rule: {
    confidence: "high",
    urls: [
      "(?:/mdbootstrap/([\\d\\.]+)/)?js/mdb\\.min\\.js",
    ],
    javascriptVariables: {
      "mdb.ScrollSpy": "",
    },
  },
  impliedSoftwares: [bootstrapSignature.name],
};
