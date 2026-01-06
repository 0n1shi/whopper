import type { Signature } from "../_types.js";

export const extJsSignature: Signature = {
  name: "ExtJS",
  description: "ExtJS is a JavaScript framework for building web apps.",
  cpe: "cpe:/a:sencha:ext_js",
  rule: {
    confidence: "high",
    urls: ["ext-base\\.js"],
    javascriptVariables: {
      Ext: "",
      "Ext.version": "^(.+)$",
      "Ext.versions.extjs.version": "^(.+)$",
    },
  },
};
