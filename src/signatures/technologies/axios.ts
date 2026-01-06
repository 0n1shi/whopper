import type { Signature } from "../_types.js";

export const axiosSignature: Signature = {
  name: "Axios",
  description: "Promise based HTTP client for the browser and node.js",
  rule: {
    confidence: "high",
    urls: [
      "/axios(@|/)([\\d.]+)(?:/[a-z]+)?/axios(?:\\.min)?\\.js",
    ],
    javascriptVariables: {
      "axios.get": "",
    },
  },
};
