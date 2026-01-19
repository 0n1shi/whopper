import type { Signature } from "../_types.js";

export const emotionSignature: Signature = {
  name: "Emotion",
  description: "Emotion is a library designed for writing CSS styles with JavaScript.",
  rule: {
    confidence: "high",
    bodies: ["data-emotion", "data-emotion-css"],
  },
};
