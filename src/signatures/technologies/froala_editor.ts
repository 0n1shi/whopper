import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const froalaEditorSignature: Signature = {
  name: "Froala Editor",
  description:
    "Froala Editor is a WYSIWYG HTML Editor written in Javascript that enables rich text editing capabilities for applications.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "FroalaEditor.VERSION": "([\\d\\.]+)",
    },
  },
  impliedSoftwares: [jquerySignature.name],
};
