import type { Signature } from "../_types.js";

export const mobxSignature: Signature = {
  name: "MobX",
  rule: {
    confidence: "high",
    urls: [
      "(?:/([\\d\\.]+))?/mobx(?:\\.[a-z]+){0,2}\\.js(?:$|\\?)",
    ],
    javascriptVariables: {
      "__mobxGlobal": "",
      "__mobxGlobals": "",
      "__mobxInstanceCount": "",
    },
  },
};
