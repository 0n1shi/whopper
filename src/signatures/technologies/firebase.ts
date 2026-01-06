import type { Signature } from "../_types.js";

export const firebaseSignature: Signature = {
  name: "Firebase",
  description:
    "Firebase is a Google-backed application development software that enables developers to develop iOS, Android and Web apps.",
  cpe: "cpe:2.3:a:google:firebase_cloud_messaging:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    headers: {
      Vary: "x-fh-requested-host",
    },
    urls: [
      "/(?:([\\d.]+)/)?firebase(?:\\.min)?\\.js",
      "/firebasejs/([\\d.]+)/firebase",
      "\\.gstatic\\.com/firebasejs/([\\d\\.]+)/",
    ],
    javascriptVariables: {
      "firebase.SDK_VERSION": "([\\d.]+)$",
    },
  },
};
