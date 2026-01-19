import type { Signature } from "../_types.js";
import { javaSignature } from "./java.js";

export const googleWebToolkitSignature: Signature = {
  name: "Google Web Toolkit",
  description: "Google Web Toolkit (GWT) is an open-source Java software development framework that makes writing AJAX applications.",
  cpe: "cpe:/a:google:web_toolkit",
  rule: {
    confidence: "high",
    bodies: [
      "<meta[^>]+name=[\"']gwt:property[\"']",
    ],
    javascriptVariables: {
      "__gwt_": "",
      "__gwt_activeModules": "",
      "__gwt_getMetaProperty": "",
      "__gwt_isKnownPropertyValue": "",
      "__gwt_stylesLoaded": "",
      "__gwtlistener": "",
    },
  },
  impliedSoftwares: [javaSignature.name],
};
