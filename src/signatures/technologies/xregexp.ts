import type { Signature } from "../_types.js";

export const xregexpSignature: Signature = {
  name: "XRegExp",
  description: "XRegExp is an extended JavaScript regular expression library.",
  rule: {
    confidence: "high",
    urls: [
      "xregexp[.-]([\\d.]*\\d)[^/]*\\.js",
      "/([\\d.]+)/xregexp(?:\\.min)?\\.js",
      "xregexp.*\\.js",
    ],
    javascriptVariables: {
      "XRegExp.version": "^(.+)$",
    },
  },
};
