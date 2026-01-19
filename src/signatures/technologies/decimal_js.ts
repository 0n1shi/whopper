import type { Signature } from "../_types.js";

export const decimalSignature: Signature = {
  name: "decimal.js",
  rule: {
    confidence: "high",
    urls: [
      "decimal[.-]([\\d.]*\\d+)(?:\\.min)?\\.js",
      "/([\\d.]*\\d+)/decimal(?:\\.min)?\\.js",
      "decimal(?:\\.min)?\\.js(?:\\?ver(?:sion)?=([\\d.]*\\d+))?",
    ],
    javascriptVariables: {
      "Decimal.ROUND_HALF_FLOOR": "",
    },
  },
};
