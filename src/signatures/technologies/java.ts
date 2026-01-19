import type { Signature } from "../_types.js";

export const javaSignature: Signature = {
  name: "Java",
  description:
    "Java is a class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.",
  cpe: "cpe:/a:oracle:jre",
  rule: {
    confidence: "high",
    cookies: {
      JSESSIONID: ".+",
    },
  },
};
