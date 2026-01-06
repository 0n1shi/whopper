import type { Signature } from "../_types.js";

export const sweetAlert2Signature: Signature = {
  name: "SweetAlert2",
  description:
    "SweetAlert2 is a beautiful, responsive, customizable, accessible replacement for JavaScript's popup boxes.",
  rule: {
    confidence: "high",
    urls: [
      "sweetalert2(?:\\.all)?(?:\\.min)?\\.js",
      "/npm/sweetalert2@([\\d.]+)",
      "sweetalert2@([\\d.]+)/dist/sweetalert2(?:\\.all)(?:\\.min)\\.js",
      "limonte-sweetalert2/([\\d.]+)/sweetalert2(?:\\.all)(?:\\.min)\\.js",
    ],
    bodies: ["<link[^>]+?href=\"[^\"]+sweetalert2(?:\\.min)?\\.css"],
    javascriptVariables: {
      Sweetalert2: "",
    },
  },
};
