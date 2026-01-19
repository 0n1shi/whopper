import type { Signature } from "../_types.js";

export const adobeFlashSignature: Signature = {
  name: "Adobe Flash",
  description: "Adobe Flash is a multimedia software platform used for production of animations, rich web applications and embedded web browser video players.",
  cpe: "cpe:/a:adobe:flash",
  rule: {
    confidence: "high",
    bodies: [
      "application/x-shockwave-flash",
      "\\.(?:swf)",
    ],
  },
};
