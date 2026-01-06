import type { Signature } from "../_types.js";

export const socketIoSignature: Signature = {
  name: "Socket.io",
  description: "Socket.io is a JavaScript library for real-time web applications.",
  rule: {
    confidence: "high",
    urls: ["socket\\.io.*\\.js"],
    javascriptVariables: {
      "io.Socket": "",
      "io.version": "^(.+)$",
    },
  },
};
