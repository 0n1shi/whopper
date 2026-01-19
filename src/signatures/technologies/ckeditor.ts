import type { Signature } from "../_types.js";

export const ckeditorSignature: Signature = {
  name: "CKEditor",
  description: "CKEditor is a WYSIWYG rich text editor which enables writing content directly inside of web pages or online applications. Its core code is written in JavaScript and it is developed by CKSource. CKEditor is available under open-source and commercial licenses.",
  cpe: "cpe:/a:ckeditor:ckeditor",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "CKEDITOR": "",
      "CKEDITOR.version": "^([\\d\\.])$",
      "CKEDITOR_BASEPATH": "",
      "apex.libVersions.ckeditor5": "^([\\d\\.])$",
    },
  },
};
