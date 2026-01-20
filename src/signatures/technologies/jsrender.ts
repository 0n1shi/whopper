import type { Signature } from "../_types.js";
import { jsviewsSignature } from "./jsviews.js";

export const jsrenderSignature: Signature = {
  name: "JsRender",
  description: "JsRender is the template library. The library is developed and maintained by Microsoft employee Boris Moore and is used in projects such as Outlook.com and Windows Azure.",
  rule: {
    confidence: "high",
    urls: [
      "([\\d\\.]+)?/jsrender(?:\\.min)?\\.js",
    ],
  },
  impliedSoftwares: [jsviewsSignature.name],
};
