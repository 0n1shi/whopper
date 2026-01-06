import type { Signature } from "../_types.js";

export const tinyMceSignature: Signature = {
  name: "TinyMCE",
  description:
    "TinyMCE is an online rich-text editor released as open-source software. TinyMCE is designed to integrate with JavaScript libraries, Vue.js, and AngularJS as well as content management systems such as Joomla!, and WordPress.",
  cpe: "cpe:2.3:a:tiny:tinymce:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    urls: ["/tiny_?mce(?:\\.min)?\\.js"],
    javascriptVariables: {
      "tinyMCE.majorVersion": "([\\d.]+)",
      tinymce: "",
    },
  },
};
