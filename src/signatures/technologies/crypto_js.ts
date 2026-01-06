import type { Signature } from "../_types.js";

export const cryptoJsSignature: Signature = {
  name: "crypto-js",
  description: "crypto-js is a JavaScript library of crypto standards.",
  rule: {
    confidence: "high",
    urls: ["(?:/([\\d\\.-]+))?/crypto-js(?:\\.min)?\\.js"],
    javascriptVariables: {
      "CryptoJS.Rabbit": "",
      "CryptoJS.algo": "",
    },
  },
};
