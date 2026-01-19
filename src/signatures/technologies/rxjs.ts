import type { Signature } from "../_types.js";

export const rxjsSignature: Signature = {
  name: "RxJS",
  description: "RxJS is a reactive library used to implement reactive programming to deal with async implementation, callbacks, and event-based programs.",
  rule: {
    confidence: "high",
    urls: [
      "rx(?:\\.\\w+)?(?:\\.compat|\\.global)?(?:\\.min)?\\.js",
    ],
    javascriptVariables: {
      "Rx.CompositeDisposable": "",
      "Rx.Symbol": "",
    },
  },
};
