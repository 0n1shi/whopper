import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const downloadMonitorSignature: Signature = {
  name: "Download Monitor",
  description:
    "Download Monitor is a plugin for selling, uploading and managing downloads, tracking downloads and displaying links.",
  rule: {
    confidence: "high",
    bodies: [
      "wp-content/plugins/download-monitor/",
      "<meta[^>]+name=[\"']dlm-version[\"'][^>]+content=[\"']([\\d\\.]+)",
    ],
    javascriptVariables: {
      DLM_XHR_Download: "",
      "dlmXHR.prevent_duplicates": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
