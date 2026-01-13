import type { Signature } from "../_types.js";

export const swiperSignature: Signature = {
  name: "Swiper",
  description:
    "Most modern mobile touch slider and framework with hardware accelerated transitions",
  cpe: "cpe:/a:swiperjs:swiper",
  rule: {
    confidence: "high",
    urls: ["swiper[@.-](\\d+\\.\\d+\\.\\d+)?"],
    bodies: ["Swiper (\\d+\\.\\d+\\.\\d+)?"],
  },
};
