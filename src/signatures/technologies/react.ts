import type { Signature } from "../_types.js";

export const reactSignature: Signature = {
  name: "React",
  description:
    "React is an open-source JavaScript library for building user interfaces or UI components.",
  cpe: "cpe:/a:facebook:react",
  rule: {
    confidence: "high",
    urls: [
      "react(?:-with-addons)?[.-](\\d+(?:\\.\\d+)+)[^/]*\\.js",
      "/([\\d.]+)/react(?:\\.min)?\\.js",
      "react\\b.*\\.js",
    ],
    bodies: ["<[^>]+data-react", "create-react-app", "react-root"],
    javascriptVariables: {
      "React.version": "([\\d.]+)",
      ReactOnRails: "",
      __REACT_ON_RAILS_EVENT_HANDLERS_RAN_ONCE__: "",
    },
  },
};
