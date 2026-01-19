import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const jplayerSignature: Signature = {
  name: "jPlayer",
  description: "jPlayer is a cross-browser JavaScript library developed as a jQuery plugin which facilitates the embedding of web based media, notably HTML5 audio and video in addition to Adobe Flash based media.",
  rule: {
    confidence: "high",
    urls: [
      "/jquery\\.jplayer\\.min\\.js",
      "jquery\\.jplayer\\.min\\.js",
    ],
    javascriptVariables: {
      "jPlayerPlaylist": "",
    },
  },
  impliedSoftwares: [jquerySignature.name],
};
