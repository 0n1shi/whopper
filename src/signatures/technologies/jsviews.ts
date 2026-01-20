import type { Signature } from "../_types.js";
import { jsobservableSignature } from "./jsobservable.js";

export const jsviewsSignature: Signature = {
  name: "JsViews",
  description: "JsViews is the MVVM library which provides two-way data binding for the template. The library is developed and maintained by Microsoft employee Boris Moore and is used in projects such as Outlook.com and Windows Azure.",
  rule: {
    confidence: "high",
    urls: [
      "([\\d\\.]+)?/jsviews(?:\\.min)?\\.js",
    ],
  },
  impliedSoftwares: [jsobservableSignature.name, "JsRender"],
};
