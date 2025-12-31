import type { Signature } from "../_types.js";

export const swiperSignature: Signature = {
  name: "Swiper",
  description:
    "Most modern mobile touch slider and framework with hardware accelerated transitions",
  rule: {
    confidence: "high",
    urls: ["swiper[@.-](\\d+\\.\\d+\\.\\d+)?"],
    bodies: ["Swiper (\\d+\\.\\d+\\.\\d+)?"],
  },
};
